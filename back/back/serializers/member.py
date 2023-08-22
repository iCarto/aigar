from rest_framework import serializers

from back.models.invoice import fixed_values
from back.models.member import Member


class MemberSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Member
        fields = "__all__"


class MemberShortSerializer(serializers.ModelSerializer):
    class Meta(object):
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
    class Meta(object):
        model = Member
        fields = [
            "id",
            "name",
            "num_socio",
            "orden",
            "sector",
            "lectura_anterior",
            "lectura",
            "consumo_calculado",
            "tarifa_calculada",
            "medidor",
            "cambio_medidor",
            "cuota_fija",
            "comision",
            "ahorro",
        ]

    id = serializers.SerializerMethodField()
    lectura_anterior = serializers.SerializerMethodField()
    lectura = serializers.SerializerMethodField()
    consumo_calculado = serializers.SerializerMethodField()
    tarifa_calculada = serializers.SerializerMethodField()
    cambio_medidor = serializers.SerializerMethodField()
    cuota_fija = serializers.SerializerMethodField()
    comision = serializers.SerializerMethodField()
    ahorro = serializers.SerializerMethodField()

    def get_id(self, obj):
        return obj.num_socio

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
            # si no tenemos caudal actual es porque las facturas todavía no tienen lecturas
            # en ese caso, la lectura anterior la sacaremos del caudal_anterior porque ya está actualizado
            return (
                last_invoice_for_member[0].caudal_actual
                or last_invoice_for_member[0].caudal_anterior
            )
        # si no tiene factura anterior se trata de un nuevo socio, por tanto su consumo anterior es 0
        return 0

    def get_lectura(self, obj):
        return None

    def get_consumo_calculado(self, obj):
        return None

    def get_tarifa_calculada(self, obj):
        return None

    def get_cambio_medidor(self, obj):
        return False

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
