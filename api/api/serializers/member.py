from api.models.invoice import fixed_values
from api.models.member import Member
from rest_framework import serializers


class MemberSerializer(serializers.HyperlinkedModelSerializer):
    num_socio = serializers.ReadOnlyField()

    class Meta:
        model = Member
        fields = "__all__"


class MemberShortSerializer(serializers.ModelSerializer):
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


class MemberExportSerializer(serializers.ModelSerializer):
    num_socio = serializers.ReadOnlyField()
    lectura_anterior = serializers.SerializerMethodField()
    cuota_fija = serializers.SerializerMethodField()
    comision = serializers.SerializerMethodField()
    ahorro = serializers.SerializerMethodField()

    class Meta:
        model = Member
        fields = [
            "num_socio",
            "name",
            "orden",
            "sector",
            "lectura_anterior",
            "medidor",
            "cuota_fija",
            "comision",
            "ahorro",
        ]

    def get_lectura_anterior(self, obj):
        last_monthly_invoices = self.context.get("last_monthly_invoices", None)
        if last_monthly_invoices is None:
            return None
        last_invoice_for_member = [
            invoice
            for invoice in last_monthly_invoices
            if invoice.member.num_socio == obj.num_socio
        ]
        if last_invoice_for_member:
            return last_invoice_for_member[0].caudal_anterior
        return None

    def get_cuota_fija(self, obj):
        return (
            fixed_values["CUOTA_FIJA_SOLO_MECHA"]
            if obj.solo_mecha
            else fixed_values["CUOTA_FIJA_NORMAL"]
        )

    def get_comision(self, obj):
        return fixed_values["COMISION"]

    def get_ahorro(self, obj):
        return (
            fixed_values["AHORRO_MANO_DE_OBRA_SOLO_MECHA"]
            if obj.solo_mecha
            else fixed_values["AHORRO_MANO_DE_OBRA_NORMAL"]
        )
