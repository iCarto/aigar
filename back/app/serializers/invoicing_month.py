from rest_framework import serializers

from app.models.invoicing_month import InvoicingMonth
from app.serializers.invoice import InvoiceShortSerializer


class InvoicingMonthSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = InvoicingMonth
        fields = "__all__"

    invoices = InvoiceShortSerializer(many=True, write_only=True, required=False)
