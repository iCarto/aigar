from rest_framework import serializers

from app.models.invoicing_month import InvoicingMonth


class InvoicingMonthSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoicingMonth
        fields = "__all__"
