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
        fields = (
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
        )

    member_data = MemberShortSerializer(source="member", many=False, read_only=True)
    mes_abierto = serializers.ReadOnlyField(source="mes_facturacion__is_open")
    mora_por_retraso = serializers.ReadOnlyField()
    mora_por_impago = serializers.ReadOnlyField()
