from api.models.invoice import Invoice
from api.models.member import Member
from rest_framework import serializers


class InvoiceMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = [
            "num_socio",
            "name",
            "sector",
            "solo_mecha",
            "consumo_maximo",
            "consumo_reduccion_fija",
        ]


class InvoiceSerializer(serializers.HyperlinkedModelSerializer):
    id_factura = serializers.ReadOnlyField()
    member = InvoiceMemberSerializer(many=False, read_only=True)

    class Meta:
        model = Invoice
        fields = "__all__"
