from django.db import transaction

from api.models.invoice import Invoice
from api.models.invoicing_month import InvoicingMonth
from api.serializers.invoice import InvoiceShortSerializer
from api.serializers.payment import PaymentSerializer
from rest_framework import serializers


class InvoicingMonthSerializer(serializers.ModelSerializer):
    id_mes_facturacion = serializers.ReadOnlyField()
    invoices = InvoiceShortSerializer(many=True, write_only=True, required=False)

    class Meta:
        model = InvoicingMonth
        fields = "__all__"

    @transaction.atomic
    def create(self, validated_data):

        invoicing_month_to_close_query = InvoicingMonth.objects.filter(is_open=True)
        if invoicing_month_to_close_query.count() > 1:
            raise serializers.ValidationError(
                "Existen varios meses de facturación abiertos. Debe revisar este problema."
            )
        invoicing_month_to_close = invoicing_month_to_close_query.first()
        if invoicing_month_to_close is not None:
            invoicing_month_to_close.is_open = False
            invoicing_month_to_close.save()

        invoices = validated_data.pop("invoices", [])
        validated_data["id_mes_facturacion"] = validated_data.get(
            "anho"
        ) + validated_data.get("mes")
        validated_data["is_open"] = True
        invoicing_month = InvoicingMonth.objects.create(**validated_data)
        for invoice in invoices:
            invoice["mes_facturacion"] = invoicing_month
            Invoice.objects.create(**invoice)
        return invoicing_month
