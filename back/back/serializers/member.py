from rest_framework import serializers

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

    # sector_id does not launch subqueries
    sector = serializers.ReadOnlyField(source="sector_id")


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

    id = serializers.ReadOnlyField(source="num_socio")
    lectura = serializers.ReadOnlyField(default=None)
    consumo_calculado = serializers.ReadOnlyField(default=None)
    tarifa_calculada = serializers.ReadOnlyField(default=None)
    cambio_medidor = serializers.ReadOnlyField(default=False)
