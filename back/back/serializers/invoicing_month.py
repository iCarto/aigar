from rest_framework import serializers

from back.models.invoicing_month import InvoicingMonth
from back.serializers.invoice import InvoiceShortSerializer


class InvoicingMonthSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = InvoicingMonth
        fields = "__all__"

    invoices = InvoiceShortSerializer(many=True, write_only=True, required=False)
