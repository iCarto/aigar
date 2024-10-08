from types import MappingProxyType

from django_filters import rest_framework as filters
from rest_framework import serializers, viewsets

from app.models.invoice import Invoice
from app.models.invoicing_month import InvoicingMonth
from app.serializers.member import MemberShortSerializer


class Filter(filters.FilterSet):
    class Meta:
        model = Invoice
        fields = MappingProxyType({"id": ("in", "exact")})


class InvoicingMonthInvoicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        exclude = ("mes_facturacion", "observaciones", "created_at", "updated_at")

    member_data = MemberShortSerializer(source="member", many=False, read_only=True)
    resumen = serializers.JSONField(allow_null=True, read_only=True)
    due_date = serializers.DateField(read_only=True)


class InvoicingMonthInvoicesViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = InvoicingMonthInvoicesSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = Filter

    def get_queryset(self):
        mes_facturacion_id = self.kwargs["mes_facturacion_id"]
        return InvoicingMonth.objects.get_invoices(mes_facturacion_id)
