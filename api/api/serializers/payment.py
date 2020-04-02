from api.models.payment import Payment
from rest_framework import serializers


class PaymentSerializer(serializers.ModelSerializer):
    id_pago = serializers.ReadOnlyField()

    class Meta:
        model = Payment
        fields = "__all__"
