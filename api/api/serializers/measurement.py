from api.models.invoice import Invoice
from api.models.measurement import Measurement
from rest_framework import serializers


class MeasurementSerializer(serializers.ModelSerializer):
    id_pago = serializers.ReadOnlyField()

    class Meta:
        model = Measurement
        fields = "__all__"

    def create(self, validated_data):
        validated_data["consumo"] = validated_data.get(
            "caudal_actual"
        ) - validated_data.get("caudal_anterior")
        measurement = Measurement.objects.create(**validated_data)

        invoice = measurement.factura
        invoice.update_with_measurement(
            measurement.caudal_anterior, measurement.caudal_actual
        )
        invoice.save()

        return measurement
