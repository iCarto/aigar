from rest_framework import serializers

from app.models.payment import Payment


class PaymentListSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        # books = [Book(**item) for item in validated_data]
        # return Book.objects.bulk_create(books)
        return Payment.objects.create_many(validated_data)


class PaymentSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Payment
        fields = ("id", "fecha", "monto", "invoice_id")
        # list_serializer_class = PaymentListSerializer
