from rest_framework import serializers

from domains.models.zone import Zone


class ZoneSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Zone
        fields = ["name", "long_name"]
