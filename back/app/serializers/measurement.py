from rest_framework import serializers

from app.models.measurement import Measurement


class MeasurementSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Measurement
        fields = "__all__"

    id_pago = serializers.ReadOnlyField()

    def create(self, validated_data):
        measurement = Measurement.objects.create(**validated_data)

        invoice = measurement.factura
        invoice.update_with_measurement(
            measurement.caudal_actual,
            measurement.caudal_anterior if measurement.cambio_medidor else None,
        )
        invoice.save()

        if measurement.cambio_medidor:
            member = invoice.member
            member.medidor = measurement.medidor
            member.save()

        return measurement
