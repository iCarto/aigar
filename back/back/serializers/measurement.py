from rest_framework import serializers

from back.models.invoice import Invoice
from back.models.measurement import Measurement


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
            measurement.caudal_actual,
            measurement.caudal_anterior if measurement.cambio_medidor == True else None,
        )
        invoice.save()

        if measurement.cambio_medidor == True:
            member = invoice.member
            member.medidor = measurement.medidor
            member.save()

        return measurement
