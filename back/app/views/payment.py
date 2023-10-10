from datetime import datetime

from rest_framework import status, viewsets
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response

from app.exceptions import ClosedMonthException
from app.models.invoice import Invoice
from app.models.invoicing_month import InvoicingMonth
from app.models.payment import Payment
from app.serializers.invoice import InvoiceSerializer
from app.serializers.payment import PaymentSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.prefetch_related("factura").all()
    serializer_class = PaymentSerializer

    def destroy(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def update(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def get_serializer(self, *args, **kwargs):
        """If an array is passed, set serializer to many."""
        # https://stackoverflow.com/a/40253309/930271
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True
        return super().get_serializer(*args, **kwargs)


class PaymentInvoicePreview(CreateAPIView):
    def post(self, request, pk):
        id_mes_facturacion = pk
        payments = request.data

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
