from api.models.invoice import Invoice
from api.models.member import Member
from api.serializers.member import MemberShortSerializer
from rest_framework import serializers


class InvoiceSerializer(serializers.ModelSerializer):
    id_factura = serializers.ReadOnlyField()
    member = MemberShortSerializer(many=False, read_only=True)
    resumen = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = "__all__"

    def get_resumen(self, obj):
        last_three_months_invoices = self.context.get(
            "last_three_months_invoices", None
        )
        if not last_three_months_invoices:
            return None

        last_three_member_invoices_status = [
            invoice.estado
            for invoice in last_three_months_invoices
            if invoice.member.num_socio == obj.member.num_socio
        ]
        return last_three_member_invoices_status


class InvoiceShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = [
            "version",
            "anho",
            "mes_facturado",
            "mes_limite",
            "anho_limite",
            "member",
            "nombre",
            "sector",
            "caudal_anterior",
            "caudal_actual",
            "consumo",
            "cuota_fija",
            "comision",
            "ahorro",
            "derecho",
            "reconexion",
            "mora",
            "saldo_pendiente",
            "total",
        ]


class InvoiceStatsSerializer(serializers.ModelSerializer):
    num_socio = serializers.IntegerField(source="member.num_socio")
    monto = serializers.IntegerField(source="total")

    class Meta:
        model = Invoice
        fields = [
            "mes_facturacion",
            "anho",
            "mes_facturado",
            "num_socio",
            "nombre",
            "sector",
            "consumo",
            "mora",
            "monto",
        ]
