from rest_framework import serializers

from app.models.measurement import Measurement


class MeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Measurement
        exclude = ("created_at", "updated_at")
