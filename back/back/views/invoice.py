from django.db.models import Max
from django.db.models import Value as V
from django.db.models.functions import Concat

from back.models.invoice import Invoice, InvoiceStatus, fixed_values
from back.models.invoicing_month import InvoicingMonth
from back.serializers.invoice import InvoiceSerializer, InvoiceStatsSerializer
from rest_framework import permissions, status, viewsets
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework_extensions.mixins import (
    ListDestroyModelMixin,
    ListUpdateModelMixin,
    NestedViewSetMixin,
)


class InvoiceViewSet(
    ListUpdateModelMixin,
    ListDestroyModelMixin,
    NestedViewSetMixin,
    viewsets.ModelViewSet,
):
    serializer_class = InvoiceSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Invoice.objects.prefetch_related("member").order_by(
            "-mes_facturacion"
        )
        num_socio = self.request.query_params.get("num_socio", None)
        if num_socio is not None:
            queryset = queryset.filter(member=num_socio)

        # For PATCH bulk operations
        # https://github.com/chibisov/drf-extensions/blob/503c22f8b442b2bff1f9060c58c024d7d4caabf2/rest_framework_extensions/bulk_operations/mixins.py#L60
        id_facturas = self.request.query_params.get("id_facturas", None)
        if id_facturas is not None:
            id_facturas_list = id_facturas.split(",") if id_facturas != "" else []
            queryset = queryset.filter(id_factura__in=id_facturas_list)

        id_mes_facturacion = self.get_parents_query_dict().get("mes_facturacion", None)
        if id_mes_facturacion is not None:
            queryset = queryset.filter(is_active=True)
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
                Invoice.objects.prefetch_related("member")
                .filter(
                    mes_facturacion__in=last_three_invoicing_months_ids, is_active=True
                )
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
        invoice.is_active = False
        invoice.save()

        # https://docs.djangoproject.com/en/2.2/topics/db/queries/#copying-model-instances
        invoice.pk = None
        invoice.version = version + 1
        invoice.estado = InvoiceStatus.NUEVA
        invoice.is_active = True
        invoice.save()
        return Response(
            InvoiceSerializer(context={"request": request}, instance=invoice).data
        )


class InvoiceStatsView(ListAPIView):
    queryset = (
        Invoice.objects.prefetch_related("member", "mes_facturacion")
        .filter(is_active=True)
        .order_by("mes_facturacion", "member")
    )
    serializer_class = InvoiceStatsSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()

        all_invoices = Invoice.objects.all().values(
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

        last_invoicing_month = InvoicingMonth.objects.filter(is_open=True).first()
        context.update(
            {
                "request": self.request,
                "all_invoices_payments_info": all_invoices_payments_info,
                "last_invoicing_month": last_invoicing_month,
            }
        )
        return context
