from django.db import transaction
from rest_framework import serializers, viewsets

from back.models.invoice import Invoice, InvoiceStatus, NoLastInvoice
from back.models.invoicing_month import InvoicingMonth
from back.models.member import Member
from back.models.payment import Payment
from back.serializers.invoicing_month import InvoicingMonthSerializer


class InvoicingMonthViewSet(viewsets.ModelViewSet):
    serializer_class = InvoicingMonthSerializer
    queryset = InvoicingMonth.objects.all()

    @transaction.atomic
    def perform_create(self, serializer):
        invoicing_month_to_close_query = InvoicingMonth.objects.filter(is_open=True)

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

        super().perform_create(serializer)

        active_members = Member.objects.filter(is_active=True)

        last_month_invoices = (
            Invoice.objects.prefetch_related("member")
            .filter(member__in=active_members, mes_facturacion__is_open=True)
            .exclude(estado=InvoiceStatus.ANULADA)
        )
        for member in active_members:
            last_invoice = [
                invoice for invoice in last_month_invoices if invoice.member == member
            ]
            last_invoice = last_invoice[0] if last_invoice else NoLastInvoice()
            Invoice.objects.create_from(member, last_invoice, serializer.instance)
