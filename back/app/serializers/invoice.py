from rest_framework import serializers

from app.models.invoice import Invoice
from app.models.invoice_value import InvoiceValue
from app.serializers.member import MemberShortSerializer


class InvoiceValueSerializer(serializers.Serializer):
    pks = serializers.ListField(
        child=serializers.IntegerField(), allow_empty=False, required=True, min_length=1
    )
    invoice_value = serializers.ChoiceField(
        choices=InvoiceValue, allow_blank=False, required=True
    )


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Invoice
        fields = "__all__"

    member_data = MemberShortSerializer(source="member", many=False, read_only=True)
    due_date = serializers.DateField(read_only=True)


class InvoiceStatsSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Invoice
        fields = [
            "mes_facturacion",
            "mes_abierto",
            "anho",
            "mes",
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
            if invoice_payment_info["invoice"] == obj.id
        ][0]
