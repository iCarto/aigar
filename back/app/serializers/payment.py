from rest_framework import serializers

from app.models.payment import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta(object):
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
