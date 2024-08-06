from rest_framework import serializers

from app.models.payment import Payment


# class PaymentListSerializer(serializers.ListSerializer):
#     def create(self, validated_data):
#         # payments = [Payment(**item) for item in validated_data]
#         # return Payment.objects.bulk_create(payments)
#         return Payment.objects.create_many(validated_data)


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        exclude = ("created_at", "updated_at")
        # list_serializer_class = PaymentListSerializer
