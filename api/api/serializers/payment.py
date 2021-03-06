from api.models.payment import Payment
from rest_framework import serializers


class PaymentSerializer(serializers.ModelSerializer):
    id_pago = serializers.ReadOnlyField()

    class Meta:
        model = Payment
        fields = "__all__"

    def create(self, validated_data):
        payment = Payment.objects.create(**validated_data)

        invoice = payment.factura
        # reload data because another payment could have updated the invoice
        invoice.refresh_from_db()
        invoice.update_with_payment(payment.fecha, payment.monto)
        invoice.save()

        return payment
