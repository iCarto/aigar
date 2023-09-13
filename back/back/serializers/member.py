from django.forms import ValidationError
from rest_framework import serializers

from back.models.member import Member
import re


class MemberSerializer(serializers.ModelSerializer):
    dia_lectura = serializers.ReadOnlyField(source="sector.measuring_day")

    class Meta(object):
        model = Member
        fields = "__all__"

    def validate_dui(self, value):
        if value and not re.match(r'^\d{8}-\d$', value):
            raise ValidationError("El campo DUI debe tener el formato 'dddddddd-d'.")
        return value


class MemberShortSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Member
        fields = [
            "num_socio",
            "name",
            "sector",
            "dia_lectura",
            "consumo_maximo",
            "consumo_reduccion_fija",
        ]

    # sector_id does not launch subqueries
    sector = serializers.ReadOnlyField(source="sector_id")
    dia_lectura = serializers.ReadOnlyField(source="sector.measuring_day")


class MemberExportSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Member
        fields = [
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
            "personas_acometida",
            "dui",
            "tipo_uso"
        ]

    lectura = serializers.ReadOnlyField(default=None)
    consumo_calculado = serializers.ReadOnlyField(default=None)
    tarifa_calculada = serializers.ReadOnlyField(default=None)
    cambio_medidor = serializers.ReadOnlyField(default=False)
