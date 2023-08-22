from rest_framework import status, viewsets
from rest_framework.response import Response

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

    def create(self, request):
        new_invoicing_month = request.data

        active_members: list[Member] = Member.objects.filter(is_active=True)

        last_invoicing_month = InvoicingMonth.objects.filter(is_open=True).first()

        id_members = [member.num_socio for member in active_members]
        last_month_invoices = (
            Invoice.objects.prefetch_related("member")
            .filter(
                member__in=id_members,
                mes_facturacion=last_invoicing_month.id_mes_facturacion,
            )
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
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
