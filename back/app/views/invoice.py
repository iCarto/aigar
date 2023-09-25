from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework_extensions.mixins import (
    ListDestroyModelMixin,
    ListUpdateModelMixin,
    NestedViewSetMixin,
)

from app.models.invoice import Invoice, InvoiceStatus
from app.models.invoicing_month import InvoicingMonth
from app.serializers.entity_status_serializer import InvoiceStatusSerializer
from app.serializers.invoice import InvoiceSerializer, InvoiceStatsSerializer


class InvoiceViewSet(
    ListUpdateModelMixin,
    ListDestroyModelMixin,
    NestedViewSetMixin,
    viewsets.ModelViewSet,
):
    serializer_class = InvoiceSerializer

    @action(detail=False, methods=["put"])
    def status(self, request):
        serializer = InvoiceStatusSerializer(data=request.data)
        if serializer.is_valid():
            Invoice.objects.update_status(
                serializer.validated_data["pks"], serializer.validated_data["status"]
            )
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        queryset = (
            Invoice.objects.with_cancelled()
            .select_related("member")
            .order_by("-mes_facturacion")
        )
        num_socio = self.request.query_params.get("num_socio", None)
        if num_socio is not None:
            queryset = queryset.filter(member=num_socio)

        id_mes_facturacion = self.get_parents_query_dict().get("mes_facturacion", None)
        if id_mes_facturacion is not None:
            queryset = queryset.exclude(estado=InvoiceStatus.ANULADA)
        return self.filter_queryset_by_parents_lookups(queryset)

    def get_serializer_context(self):
        context = super().get_serializer_context()

        id_mes_facturacion = self.get_parents_query_dict().get("mes_facturacion", None)
        if id_mes_facturacion is not None:
            try:
                invoicing_month = InvoicingMonth.objects.get(pk=id_mes_facturacion)
            except:
                return context
            last_three_invoicing_months = (
                InvoicingMonth.objects.all()
                .filter(id_mes_facturacion__lt=invoicing_month.id_mes_facturacion)
                .order_by("-id_mes_facturacion")[:3]
            )
            last_three_invoicing_months_ids = [
                invoicing_month.id_mes_facturacion
                for invoicing_month in last_three_invoicing_months
            ]
            last_three_months_invoices = (
                Invoice.objects.select_related("member")
                .filter(mes_facturacion__in=last_three_invoicing_months_ids)
                .order_by("-mes_facturacion")
            )

            context.update(
                {
                    "request": self.request,
                    "last_three_months_invoices": last_three_months_invoices,
                }
            )
        return context

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
            "id_factura",
            "mes_facturacion",
            "mes_facturado",
            "anho",
            "member",
            "total",
            "pago_1_al_10",
            "pago_11_al_30",
            "mora",
        )

        all_invoices_payments_info = []
        for invoice in all_invoices:
            mes_facturado = invoice["mes_facturado"]
            previous_mes_facturado = 12 if mes_facturado == 1 else mes_facturado - 1
            previous_anho = (
                invoice["anho"] - 1 if mes_facturado == 1 else invoice["anho"]
            )
            previous_invoice = [
                previous_invoice
                for previous_invoice in all_invoices
                if previous_invoice["mes_facturado"] == previous_mes_facturado
                and previous_invoice["anho"] == previous_anho
                and previous_invoice["member"] == invoice["member"]
            ]
            previous_invoice = previous_invoice[0] if previous_invoice else None
            invoice_payment_info = {
                "id_factura": invoice["id_factura"],
                "mora": invoice["mora"],
                "mora_por_retraso": 1
                if invoice["mora"] != 0
                and (
                    previous_invoice is None
                    or (
                        previous_invoice["pago_1_al_10"] == 0
                        and previous_invoice["pago_11_al_30"] != 0
                    )
                )
                else 0,
                "mora_por_impago": 1
                if invoice["mora"] != 0
                and previous_invoice is not None
                and previous_invoice["pago_1_al_10"] == 0
                and previous_invoice["pago_11_al_30"] == 0
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
