from api.models.invoice import Invoice
from api.models.member import Member
from api.serializers.member import MemberShortSerializer
from rest_framework import serializers


class InvoiceSerializer(serializers.ModelSerializer):
    id_factura = serializers.ReadOnlyField()
    member = MemberShortSerializer(many=False, read_only=True)

    class Meta:
        model = Invoice
        fields = "__all__"


class InvoiceShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = [
            "anho",
            "mes_facturado",
            "mes_limite",
            "member",
            "nombre",
            "sector",
            "caudal_anterior",
            "caudal_actual",
            "consumo",
            "total",
        ]
