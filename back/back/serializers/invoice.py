from rest_framework import serializers

from back.models.invoice import Invoice
from back.models.member import Member
from back.serializers.member import MemberShortSerializer


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Invoice
        exclude = ("member",)

    id_factura = serializers.ReadOnlyField()
    num_socio = serializers.PrimaryKeyRelatedField(
        source="member", queryset=Member.objects.all()
    )
    member_data = serializers.SerializerMethodField()
    resumen = serializers.SerializerMethodField()

    def get_member_data(self, obj):
        member_data_serializer = MemberShortSerializer(
            obj.member, many=False, read_only=True
        )
        return member_data_serializer.data

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
    class Meta(object):
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
    class Meta(object):
        model = Invoice
        fields = [
            "mes_facturacion",
            "mes_abierto",
            "anho",
            "mes_facturado",
            "num_socio",
            "nombre",
            "sector",
            "consumo",
            "mora",
            "mora_por_retraso",
            "mora_por_impago",
            "monto",
            "deuda",
            "total",
        ]

    num_socio = serializers.IntegerField(source="member.num_socio")
    mes_abierto = serializers.SerializerMethodField()
    monto = serializers.SerializerMethodField()
    deuda = serializers.SerializerMethodField()
    mora_por_retraso = serializers.SerializerMethodField()
    mora_por_impago = serializers.SerializerMethodField()

    def get_mes_abierto(self, obj):
        last_invoicing_month = self.context.get("last_invoicing_month", None)
        return (
            last_invoicing_month is not None
            and obj.mes_facturacion.id_mes_facturacion
            == last_invoicing_month.id_mes_facturacion
        )

    def get_deuda(self, obj):
        return (obj.total if obj.total is not None else 0) - (
            obj.pago_1_al_10 + obj.pago_11_al_30
        )

    def get_monto(self, obj):
        return obj.pago_1_al_10 + obj.pago_11_al_30

    def get_mora_por_retraso(self, obj):
        all_invoices_payments_info = self.context.get(
            "all_invoices_payments_info", None
        )
        invoice_payment_info = [
            invoice_payment_info
            for invoice_payment_info in all_invoices_payments_info
            if invoice_payment_info["id_factura"] == obj.id_factura
        ][0]
        return invoice_payment_info["mora_por_retraso"]

    def get_mora_por_impago(self, obj):
        all_invoices_payments_info = self.context.get(
            "all_invoices_payments_info", None
        )
        invoice_payment_info = [
            invoice_payment_info
            for invoice_payment_info in all_invoices_payments_info
            if invoice_payment_info["id_factura"] == obj.id_factura
        ][0]
        return invoice_payment_info["mora_por_impago"]
