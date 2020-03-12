from api.models import invoice
from rest_framework import serializers


class InvoiceSerializer(serializers.HyperlinkedModelSerializer):
    id_factura = serializers.ReadOnlyField()

    class Meta:
        model = invoice.Invoice
        fields = "__all__"
