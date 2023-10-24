from rest_framework import serializers

from app.models.member import Member


class MemberSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Member
        fields = "__all__"


class MemberCreateSerializer(MemberSerializer):
    selected_fee_value = serializers.DecimalField(
        required=True, write_only=True, max_digits=5, decimal_places=2
    )


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
        ]

    num_socio = serializers.ReadOnlyField(source="id")
    lectura = serializers.ReadOnlyField(default=None)
    consumo_calculado = serializers.ReadOnlyField(default=None)
    tarifa_calculada = serializers.ReadOnlyField(default=None)
    cambio_medidor = serializers.ReadOnlyField(default=False)

    lectura_anterior = serializers.ReadOnlyField(default=None)
    cuota_fija = serializers.ReadOnlyField(default=5.72)
    comision = serializers.ReadOnlyField(default=0.28)
    ahorro = serializers.ReadOnlyField(default=0.25)


class MemberExportSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Member
        fields = [
            "name",
            "id",
            "orden",
            "sector",
            "caudal_anterior",
            "caudal_actual",
            "consumo",
            "tarifa_calculada",
            "medidor",
            "cambio_medidor",
            "cuota_fija",
            "comision",
            "ahorro",
            "tipo_uso",
        ]

    caudal_actual = serializers.ReadOnlyField(default=None)
    consumo = serializers.ReadOnlyField(default=None)
    tarifa_calculada = serializers.ReadOnlyField(default=None)
    cambio_medidor = serializers.ReadOnlyField(default=False)
