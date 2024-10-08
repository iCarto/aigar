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
    class Meta:
        model = Invoice
        fields = "__all__"

    member_data = MemberShortSerializer(source="member", many=False, read_only=True)
    due_date = serializers.DateField(read_only=True)


class InvoicePreviewSerializer(InvoiceSerializer):
    has_payments = serializers.SerializerMethodField()
    has_measurements = serializers.SerializerMethodField()

    def get_has_payments(self, obj):
        return obj.payment_set.exists()

    def get_has_measurements(self, obj):
        return obj.measurement_set.exists()


class InvoiceStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = (
            "mes_facturacion",
            "mes_abierto",
            "anho",
            "mes",
            "consumo",
            "mora",
            "mora_por_retraso",
            "mora_por_impago",
            "mora_por_msg",
            "monto",
            "deuda",
            "total",
            "member_data",
        )

    member_data = MemberShortSerializer(source="member", many=False, read_only=True)
    mes_abierto = serializers.ReadOnlyField(source="mes_facturacion.is_open")
    mora_por_retraso = serializers.ReadOnlyField()
    mora_por_impago = serializers.ReadOnlyField()
    mora_por_msg = serializers.SerializerMethodField()

    def get_mora_por_msg(self, obj):
        if obj.mora_por_impago and obj.mora_por_retraso:
            return "Impago y Retraso"
        if obj.mora_por_impago:
            return "Impago"
        if obj.mora_por_retraso:
            return "Retraso"
        return ""
