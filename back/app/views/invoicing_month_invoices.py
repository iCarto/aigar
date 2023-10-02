from rest_framework import serializers, viewsets

from app.models.invoice import Invoice
from app.models.invoicing_month import InvoicingMonth
from app.models.member import Member


class MemberShortSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Member
        fields = ["num_socio", "name", "status", "sector"]

    # sector_id does not launch subqueries
    sector = serializers.ReadOnlyField(source="sector_id")


class InvoicingMonthInvoicesSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Invoice
        fields = [
            "id_factura",
            "mes_facturacion_id",
            "caudal_actual",
            "caudal_anterior",
            "total",
            "estado",
            "member_data",
            "resumen",
        ]

    member_data = MemberShortSerializer(source="member", many=False, read_only=True)
    resumen = serializers.JSONField(allow_null=True, read_only=True)


class InvoicingMonthInvoicesViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = InvoicingMonthInvoicesSerializer

    def get_queryset(self):
        mes_facturacion_id = self.kwargs["mes_facturacion_id"]
        return InvoicingMonth.objects.get_invoices(mes_facturacion_id)
