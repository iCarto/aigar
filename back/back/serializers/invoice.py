from rest_framework import serializers

from back.models.invoice import Invoice
from back.serializers.member import MemberShortSerializer


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Invoice
        fields = "__all__"

    member_data = MemberShortSerializer(source="member", many=False, read_only=True)
    resumen = serializers.SerializerMethodField()

    def get_resumen(self, obj):
        last_three_months_invoices = self.context.get("last_three_months_invoices")
        if not last_three_months_invoices:
            return None

        return [
            invoice.estado
            for invoice in last_three_months_invoices
            if invoice.member.num_socio == obj.member.num_socio
        ]


class InvoiceShortSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Invoice
        fields = [
            "version",
            "anho",
            "mes_facturado",
            "mes_limite",
            "anho_limite",
            "member",
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
    class Meta(object):
        model = Invoice
        fields = [
            "mes_facturacion",
            "mes_abierto",
            "anho",
            "mes_facturado",
            "consumo",
            "mora",
            "mora_por_retraso",
            "mora_por_impago",
            "monto",
            "deuda",
            "total",
            "member_data",
        ]

    member_data = MemberShortSerializer(source="member", many=False, read_only=True)
    mes_abierto = serializers.SerializerMethodField()
    mora_por_retraso = serializers.SerializerMethodField()
    mora_por_impago = serializers.SerializerMethodField()

    def get_mes_abierto(self, obj):
        last_invoicing_month = self.context["last_invoicing_month"]
        return (
            last_invoicing_month is not None
            and obj.mes_facturacion.id_mes_facturacion
            == last_invoicing_month.id_mes_facturacion
        )

    def get_mora_por_retraso(self, obj):
        invoice_payment_info = self._get_invoice_payment_info(obj)
        return invoice_payment_info["mora_por_retraso"]

    def get_mora_por_impago(self, obj):
        invoice_payment_info = self._get_invoice_payment_info(obj)
        return invoice_payment_info["mora_por_impago"]

    def _get_invoice_payment_info(self, obj):
        all_invoices_payments_info = self.context["all_invoices_payments_info"]
        return [
            invoice_payment_info
            for invoice_payment_info in all_invoices_payments_info
            if invoice_payment_info["id_factura"] == obj.id_factura
        ][0]
