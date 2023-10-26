from rest_framework import serializers

from domains.models.aigar_config import AigarConfig
from domains.models.zone import Zone


class ZoneSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Zone
        fields = ["name", "long_name", "reading_day"]


class AigarConfigSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = AigarConfig()
        exclude = (
            "nuevo_derecho_siguientes_cuotas_opcion1",
            "nuevo_derecho_siguientes_cuotas_opcion2",
            "nuevo_derecho_siguientes_cuotas_opcion3",
        )

    nuevo_derecho_siguientes_cuotas_opciones = serializers.ReadOnlyField()
