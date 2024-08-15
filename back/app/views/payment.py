import datetime
import logging
from typing import Any

from django.db import transaction
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from typing_extensions import override

from app.models.invoice import Invoice
from app.models.payment import Payment
from app.serializers.invoice import InvoicePreviewSerializer
from app.serializers.payment import PaymentSerializer


logger = logging.getLogger(__name__)


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.prefetch_related("invoice").all()
    serializer_class = PaymentSerializer

    @override
    def retrieve(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @override
    def list(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @override
    def destroy(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @override
    def update(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @override
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        payments: list[dict[str, Any]] = request.data
        payments_without_invoice = [m for m in payments if not m["invoice"]]
        logger.warning("No hay recibo para la lecturas %s", payments_without_invoice)
        payments = [m for m in payments if m["invoice"]]

        serializer = self.get_serializer(data=payments, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    @action(detail=False, methods=["post"])
    def previewinvoices(self, request):
        payments = request.data
        invoices = get_invoices_for_payments(payments)
        updated_invoices = get_updated_invoices(payments, invoices)
        serializer = InvoicePreviewSerializer(
            data=updated_invoices, many=True, context={"request": request}
        )
        serializer.is_valid()
        return Response(serializer.data)

    # def get_serializer(self, *args, **kwargs):
    #     """If an array is passed, set serializer to many."""
    #     # https://stackoverflow.com/a/40253309/930271
    #     if isinstance(kwargs.get("data", {}), list):
    #         kwargs["many"] = True
    #     return super().get_serializer(*args, **kwargs)


def get_invoices_for_payments(payments) -> dict[int, Invoice]:
    invoice_ids = [payment["invoice"] for payment in payments]
    invoices = Invoice.objects.prefetch_related("member").filter(
        id__in=invoice_ids, mes_facturacion__is_open=True
    )
    return {invoice.id: invoice for invoice in invoices}


def get_updated_invoices(payments, invoices):
    updated_invoices = []
    for payment in payments:
        invoice = invoices.get(payment["invoice"])
        if invoice:
            invoice.update_with_payment(
                datetime.date.fromisoformat(payment["fecha"]), payment["monto"]
            )
            updated_invoices.append(invoice)
    return updated_invoices
