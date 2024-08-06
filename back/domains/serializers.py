from rest_framework import serializers

from domains.models.aigar_config import AigarConfig
from domains.models.zone import Zone


class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = ("name", "long_name", "reading_day")


class AigarConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = AigarConfig()
        exclude = (
            "nuevo_derecho_siguientes_cuotas_opcion1",
            "nuevo_derecho_siguientes_cuotas_opcion2",
            "nuevo_derecho_siguientes_cuotas_opcion3",
            "nuevo_derecho_siguientes_cuotas_opcion4",
            "nuevo_derecho_siguientes_cuotas_opcion5",
            "nuevo_derecho_siguientes_cuotas_opcion6",
            "humano_cuota_variable_primer_tramo_cantidad",
            "humano_cuota_variable_primer_tramo_coste",
            "humano_cuota_variable_segundo_tramo_cantidad",
            "humano_cuota_variable_segundo_tramo_coste",
            "humano_cuota_variable_tercer_tramo_cantidad",
            "humano_cuota_variable_tercer_tramo_coste",
            "humano_cuota_variable_cuarto_tramo_cantidad",
            "humano_cuota_variable_cuarto_tramo_coste",
            "humano_cuota_variable_quinto_tramo_cantidad",
            "humano_cuota_variable_quinto_tramo_coste",
            "humano_cuota_variable_sexto_tramo_cantidad",
            "humano_cuota_variable_sexto_tramo_coste",
            "humano_cuota_variable_septimo_tramo_cantidad",
            "humano_cuota_variable_septimo_tramo_coste",
            "humano_cuota_variable_octavo_tramo_cantidad",
            "humano_cuota_variable_octavo_tramo_coste",
            "comercial_cuota_variable_primer_tramo_cantidad",
            "comercial_cuota_variable_primer_tramo_coste",
            "comercial_cuota_variable_segundo_tramo_cantidad",
            "comercial_cuota_variable_segundo_tramo_coste",
            "comercial_cuota_variable_tercer_tramo_cantidad",
            "comercial_cuota_variable_tercer_tramo_coste",
            "comercial_cuota_variable_cuarto_tramo_cantidad",
            "comercial_cuota_variable_cuarto_tramo_coste",
            "comercial_cuota_variable_quinto_tramo_cantidad",
            "comercial_cuota_variable_quinto_tramo_coste",
            "comercial_cuota_variable_sexto_tramo_cantidad",
            "comercial_cuota_variable_sexto_tramo_coste",
            "comercial_cuota_variable_septimo_tramo_cantidad",
            "comercial_cuota_variable_septimo_tramo_coste",
            "comercial_cuota_variable_octavo_tramo_cantidad",
            "comercial_cuota_variable_octavo_tramo_coste",
        )

    nuevo_derecho_siguientes_cuotas_opciones = serializers.ReadOnlyField()
    humano_tramos = serializers.ReadOnlyField()
    comercial_tramos = serializers.ReadOnlyField()
