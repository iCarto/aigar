from django.db import transaction
from rest_framework import serializers

from back.models.invoice import Invoice, InvoiceStatus
from back.models.invoicing_month import InvoicingMonth
from back.models.payment import Payment
from back.serializers.invoice import InvoiceShortSerializer


class InvoicingMonthSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = InvoicingMonth
        fields = "__all__"

    invoices = InvoiceShortSerializer(many=True, write_only=True, required=False)

    @transaction.atomic
    def create(self, validated_data):
        invoicing_month_to_close_query = InvoicingMonth.objects.filter(is_open=True)
        if invoicing_month_to_close_query.count() > 1:
            raise serializers.ValidationError(
                "Existen varios meses de facturación abiertos. Debe revisar este problema."
            )
        invoicing_month_to_close = invoicing_month_to_close_query.first()

        invoicing_month_to_close_payments = Payment.objects.filter(
            mes_facturacion=invoicing_month_to_close
        ).count()
        if invoicing_month_to_close_payments == 0:
            raise serializers.ValidationError(
                "El mes anterior no ha importado ningún pago. Revise si la facturación del mes que va a cerrar está correcta."
            )

        if invoicing_month_to_close is not None:
            invoicing_month_to_close.is_open = False
            invoicing_month_to_close.save()

            last_month_invoices = Invoice.objects.filter(
                mes_facturacion=invoicing_month_to_close
            )
            for last_month_invoice in last_month_invoices:
                if (
                    last_month_invoice.estado == InvoiceStatus.NUEVA
                    or last_month_invoice.estado == InvoiceStatus.PENDIENTE_DE_COBRO
                ):
                    if (
                        last_month_invoice.total is not None
                        and (
                            last_month_invoice.pago_1_al_10
                            + last_month_invoice.pago_11_al_30
                        )
                        >= last_month_invoice.total
                    ):
                        last_month_invoice.estado = InvoiceStatus.COBRADA
                    else:
                        last_month_invoice.estado = InvoiceStatus.NO_COBRADA
                    last_month_invoice.save()

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
