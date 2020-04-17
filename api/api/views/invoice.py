from django.db.models import Max
from django.db.models import Value as V
from django.db.models.functions import Concat

from api.models.invoice import Invoice, InvoiceStatus, fixed_values
from api.models.invoicing_month import InvoicingMonth
from api.serializers.invoice import InvoiceSerializer, InvoiceStatsSerializer
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
        queryset = Invoice.objects.prefetch_related("member")
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
        context = super(InvoiceViewSet, self).get_serializer_context()

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
        Invoice.objects.prefetch_related("member")
        .filter(is_active=True)
        .order_by("-mes_facturacion", "member")
    )
    serializer_class = InvoiceStatsSerializer
