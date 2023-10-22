from rest_framework import serializers

from app.models.member import Member


class MemberSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Member
        fields = "__all__"


class MemberShortSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Member
        fields = [
            "id",
            "name",
            "tipo_uso",
            "status",
            "sector",
            "consumo_maximo",
            "consumo_reduccion_fija",
        ]

    # sector_id does not launch subqueries
    sector = serializers.ReadOnlyField(source="sector_id")


class MemberExportSerializerV1(serializers.ModelSerializer):
    class Meta(object):
        model = Member
        fields = [
            "name",
            "id",
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
            "personas_acometida",
            "dui",
            "tipo_uso",
        ]

    num_socio = serializers.ReadOnlyField(source="id")
    lectura = serializers.ReadOnlyField(default=None)
    consumo_calculado = serializers.ReadOnlyField(default=None)
    tarifa_calculada = serializers.ReadOnlyField(default=None)
    cambio_medidor = serializers.ReadOnlyField(default=False)


class MemberExportSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Member
        fields = [
            "name",
            "id",
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
            "personas_acometida",
            "dui",
            "tipo_uso",
        ]

    lectura = serializers.ReadOnlyField(default=None)
    consumo_calculado = serializers.ReadOnlyField(default=None)
    tarifa_calculada = serializers.ReadOnlyField(default=None)
    cambio_medidor = serializers.ReadOnlyField(default=False)
