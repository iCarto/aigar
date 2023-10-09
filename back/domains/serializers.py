from rest_framework import serializers

from domains.models.aigar_config import AigarConfig
from domains.models.zone import Zone


class ZoneSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Zone
        fields = ["name", "long_name", "reading_day"]


class BasicConfigSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = AigarConfig()
        fields = "__all__"
