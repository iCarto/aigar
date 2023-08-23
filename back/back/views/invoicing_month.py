from django.db import transaction
from rest_framework import viewsets

from back.models.fixed_values import (
    get_derecho_value,
    get_mora_value,
    get_reconexion_value,
    get_saldo_pendiente_value,
)
from back.models.invoice import Invoice, InvoiceStatus
from back.models.invoicing_month import InvoicingMonth
from back.models.member import Member
from back.serializers.invoicing_month import InvoicingMonthSerializer


class InvoicingMonthViewSet(viewsets.ModelViewSet):
    serializer_class = InvoicingMonthSerializer
    queryset = InvoicingMonth.objects.all()

    @transaction.atomic
    def perform_create(self, serializer):
        super().perform_create(serializer)

        active_members = Member.objects.filter(is_active=True)

        last_month_invoices = (
            Invoice.objects.prefetch_related("member")
            .filter(member__in=active_members, mes_facturacion__is_open=True)
            .exclude(estado=InvoiceStatus.ANULADA)
        )

        new_invoicing_month["invoices"] = []
        for member in active_members:
            last_month_invoice = [
                invoice
                for invoice in last_month_invoices
                if invoice.member.num_socio == member.num_socio
            ]
            last_month_invoice = last_month_invoice[0] if last_month_invoice else None
            invoice = {
                # New monthly invoices are always version 1
                "version": 1,
                "anho": new_invoicing_month["anho"],
                "mes_facturado": new_invoicing_month["mes"],
                "mes_limite": 1
                if int(new_invoicing_month["mes"]) + 1 > 12
                else int(new_invoicing_month["mes"]) + 1,
                "anho_limite": new_invoicing_month["anho"]
                if int(new_invoicing_month["mes"]) != 12
                else int(new_invoicing_month["anho"]) + 1,
                "member": member.num_socio,
                "nombre": member.name,
                "sector": member.sector,
                "cuota_fija": member.cuota_fija,
                "comision": member.comision,
                "ahorro": member.ahorro,
                "caudal_anterior": last_month_invoice.caudal_actual
                if last_month_invoice
                else 0,
                "derecho": get_derecho_value(last_month_invoice),
                "reconexion": get_reconexion_value(member, last_month_invoice),
                "mora": get_mora_value(last_month_invoice),
                "saldo_pendiente": get_saldo_pendiente_value(last_month_invoice),
            }
            new_invoicing_month["invoices"].append(invoice)

        serializer = InvoicingMonthSerializer(
            data=new_invoicing_month, context={"request": request}
        )
            last_invoice = last_invoice[0] if last_invoice else NoLastInvoice()
            Invoice.objects.create_from(member, last_invoice, serializer.instance)
