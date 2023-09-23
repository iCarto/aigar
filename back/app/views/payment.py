from datetime import datetime

from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import mixins, status, viewsets
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework_extensions.mixins import NestedViewSetMixin

from app.exceptions import ClosedMonthException
from app.models.invoice import Invoice
from app.models.invoicing_month import InvoicingMonth
from app.models.payment import Payment
from app.serializers.invoice import InvoiceSerializer
from app.serializers.payment import PaymentSerializer


class PaymentViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    NestedViewSetMixin,
    viewsets.GenericViewSet,
):
    queryset = Payment.objects.prefetch_related("factura").all()
    serializer_class = PaymentSerializer

    # SQLite performance is slow when we have a lot of insert or update operations
    # Including these operations inside an atomic transaction improves that
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        # To create payments through /invocingmonth/<id>/payments
        # https://stackoverflow.com/questions/35879857/check-permissions-on-a-related-object-in-django-rest-framework

        id_mes_facturacion = self.get_parents_query_dict().get("mes_facturacion", None)
        payments = request.data

        invoicing_month = get_object_or_404(InvoicingMonth, pk=id_mes_facturacion)
        if not invoicing_month.is_open:
            raise ClosedMonthException()

        invoices = get_invoices_for_payments(payments)

        for payment in payments:
            invoice = get_invoice_by_id_factura(invoices, payment["id_factura"])
            payment["factura"] = payment["id_factura"]
            payment["mes_facturacion"] = id_mes_facturacion

        serializer = PaymentSerializer(
            data=payments, many=True, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PaymentInvoicePreview(CreateAPIView):
    def post(self, request, pk):
        id_mes_facturacion = pk
        payments = request.data

        invoicing_month = get_object_or_404(InvoicingMonth, pk=id_mes_facturacion)
        if not invoicing_month.is_open:
            raise ClosedMonthException()

        invoices = get_invoices_for_payments(payments)
        updated_invoices = []
        for payment in payments:
            invoice = get_invoice_by_id_factura(invoices, payment["id_factura"])
            if invoice is not None:
                fecha = datetime.strptime(payment["fecha"], "%Y-%m-%d")
                invoice.update_with_payment(fecha, payment["monto"])
                updated_invoices.append(invoice)
        serializer = InvoiceSerializer(
            data=updated_invoices, many=True, context={"request": request}
        )
        serializer.is_valid()
        return Response(serializer.data)


def get_invoices_for_payments(payments):
    num_socios = [payment["id_factura"] for payment in payments]
    return Invoice.objects.filter(id_factura__in=num_socios)


def get_invoice_by_id_factura(invoices, id_factura):
    invoice = [invoice for invoice in invoices if id_factura == invoice.id_factura]
    if invoice:
        return invoice[0]
    return None
