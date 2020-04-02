from api.models.invoice import Invoice
from api.models.invoicing_month import InvoicingMonth
from api.serializers.invoice import InvoiceSerializer
from api.serializers.payment import PaymentSerializer
from rest_framework import serializers


class InvoicingMonthSerializer(serializers.HyperlinkedModelSerializer):
    id_mes_facturacion = serializers.ReadOnlyField()

    class Meta:
        model = InvoicingMonth
        fields = "__all__"


class InvoicingMonthWithInvoicesSerializer(serializers.HyperlinkedModelSerializer):
    id_mes_facturacion = serializers.ReadOnlyField()

    invoices = serializers.SerializerMethodField()  # call to get_invoices

    def get_invoices(self, obj):
        # return only invoices that are in invoices_ids array (for PATCH operation)
        # or return all invoices for this month
        invoices = self.context.get("invoices")
        invoices_ids = self.context.get("invoices_ids")
        if invoices is not None:
            data = invoices
        elif invoices_ids is not None:
            data = (
                Invoice.objects.prefetch_related("member")
                .filter(id_factura__in=invoices_ids)
                .all()
            )
        else:
            data = (
                Invoice.objects.prefetch_related("member")
                .filter(mes_facturacion=obj.id_mes_facturacion)
                .all()
            )
        serializer = InvoiceSerializer(
            data=data, context={"request": self.context["request"]}, many=True
        )
        serializer.is_valid()
        return serializer.data

    class Meta:
        model = InvoicingMonth
        fields = "__all__"
