from django_filters import rest_framework as filters
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.response import Response

from app.models.invoice import Invoice, InvoiceStatus
from app.models.invoicing_month import InvoicingMonth
from app.serializers.entity_status_serializer import InvoiceStatusSerializer
from app.serializers.invoice import (
    InvoiceSerializer,
    InvoiceStatsSerializer,
    InvoiceValueSerializer,
)
from app.serializers.payment import PaymentSerializer


class InvoiceFilter(filters.FilterSet):
    class Meta(object):
        model = Invoice
        fields = ("member_id",)


class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = InvoiceFilter
    queryset = Invoice.objects.with_cancelled().select_related(
        "member", "member__sector"
    )

    @action(detail=True, methods=["get"])
    def payments(self, request, pk=None):
        instance = self.get_object()
        serializer = PaymentSerializer(instance.payment_set.all(), many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["put"])
    def status(self, request):
        serializer = InvoiceStatusSerializer(data=request.data)
        if serializer.is_valid():
            Invoice.objects.update_status(
                serializer.validated_data["pks"], serializer.validated_data["status"]
            )
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["put"])
    def value(self, request):
        serializer = InvoiceValueSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            Invoice.objects.update_value(data["pks"], data["invoice_value"])
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["put"])
    def total(self, request, pk=None):
        instance = self.get_object()

        def noop_save(*args, **kwargs):  # noqa: WPS430
            """Don't save the instance, just recalculate values and return then."""

        instance.save = noop_save
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        instance.update_total()

        return Response(serializer.data)

    # Override destroy method to set Invoice as inactive and return a new version of the same invoice
    def destroy(self, request, *args, **kwargs):
        invoice = self.get_object()
        version = invoice.version
        invoice.estado = InvoiceStatus.ANULADA
        invoice.save()

        # https://docs.djangoproject.com/en/2.2/topics/db/queries/#copying-model-instances
        invoice.pk = None
        invoice.version = version + 1
        invoice.estado = InvoiceStatus.NUEVA
        invoice.save()
        return Response(
            InvoiceSerializer(context={"request": request}, instance=invoice).data
        )


class InvoiceStatsView(ListAPIView):
    queryset = Invoice.objects.prefetch_related("member", "mes_facturacion").order_by(
        "mes_facturacion", "member"
    )
    serializer_class = InvoiceStatsSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()

        all_invoices = Invoice.objects.values(
            "id",
            "mes_facturacion",
            "mes",
            "anho",
            "member",
            "total",
            "ontime_payment",
            "late_payment",
            "mora",
        )

        all_invoices_payments_info = []
        for invoice in all_invoices:
            mes = int(invoice["mes"])
            anho = int(invoice["anho"])
            previous_mes = str(12 if mes == 1 else mes - 1).zfill(2)
            previous_anho = str(anho - 1 if mes == 1 else anho)
            previous_invoice = [
                previous_invoice
                for previous_invoice in all_invoices
                if previous_invoice["mes"] == previous_mes
                and previous_invoice["anho"] == previous_anho
                and previous_invoice["member"] == invoice["member"]
            ]
            previous_invoice = previous_invoice[0] if previous_invoice else None
            invoice_payment_info = {
                "invoice": invoice["id"],
                "mora": invoice["mora"],
                "mora_por_retraso": 1
                if invoice["mora"] != 0
                and (
                    previous_invoice is None
                    or (
                        previous_invoice["ontime_payment"] == 0
                        and previous_invoice["late_payment"] != 0
                    )
                )
                else 0,
                "mora_por_impago": 1
                if invoice["mora"] != 0
                and previous_invoice is not None
                and previous_invoice["ontime_payment"] == 0
                and previous_invoice["late_payment"] == 0
                else 0,
            }
            all_invoices_payments_info.append(invoice_payment_info)

        last_invoicing_month = InvoicingMonth.objects.get(is_open=True)
        context.update(
            {
                "request": self.request,
                "all_invoices_payments_info": all_invoices_payments_info,
                "last_invoicing_month": last_invoicing_month,
            }
        )
        return context
