from rest_framework import serializers

from domains.models.basic_config import BasicConfig
from domains.models.zone import Zone


class ZoneSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Zone
        fields = ["name", "long_name", "measuring_day"]


class BasicConfigSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = BasicConfig()
        fields = "__all__"
