import datetime
import logging
from typing import Any

from django.db import transaction
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from app.models.invoice import Invoice
from app.models.invoicing_month import InvoicingMonth
from app.models.payment import Payment
from app.serializers.invoice import InvoiceSerializer
from app.serializers.payment import PaymentSerializer


logger = logging.getLogger(__name__)


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.prefetch_related("invoice").all()
    serializer_class = PaymentSerializer

    def retrieve(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def list(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def update(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        payments: list[dict[str, Any]] = request.data
        payments_without_invoice = [m for m in payments if not m["invoice"]]
        logger.warning(
            "No hay factura para la lecturas %s",  # noqa: WPS323
            payments_without_invoice,
        )
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
        updated_invoices = []
        for payment in payments:
            invoice = get_invoice_by_id_factura(invoices, payment["invoice"])
            if invoice:
                invoice.update_with_payment(
                    datetime.date.fromisoformat(payment["fecha"]), payment["monto"]
                )
                updated_invoices.append(invoice)
        serializer = InvoiceSerializer(
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


def get_invoices_for_payments(payments):
    invoicing_month = InvoicingMonth.objects.get(is_open=True)
    invoice_ids = [payment["invoice"] for payment in payments]
    return Invoice.objects.prefetch_related("member").filter(
        id__in=invoice_ids, mes_facturacion=invoicing_month
    )


def get_invoice_by_id_factura(invoices, invoice_id):
    for invoice in invoices:
        if invoice_id == invoice.id:
            return invoice
    return None
