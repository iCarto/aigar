from rest_framework import serializers

from app.models.measurement import Measurement


class MeasurementSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Measurement
        fields = "__all__"
