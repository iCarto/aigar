from django.db.models import Max
from django.db.models import Value as V
from django.db.models.functions import Concat

from api.models.invoice import Invoice, fixed_values
from api.models.invoicing_month import InvoicingMonth
from api.models.member import Member
from api.serializers.invoice import InvoiceSerializer
from api.serializers.invoicing_month import InvoicingMonthSerializer
from rest_framework import status, viewsets
from rest_framework.response import Response


class InvoicingMonthViewSet(viewsets.ModelViewSet):
    serializer_class = InvoicingMonthSerializer
    queryset = InvoicingMonth.objects.all()

    def create(self, request):

        new_invoicing_month = request.data

        active_members = Member.objects.filter(is_active=True)
        new_invoicing_month["invoices"] = []
        for member in active_members:
            invoice = {
                "anho": new_invoicing_month["anho"],
                "mes_facturado": new_invoicing_month["mes"],
                # Is mes_limite necessary and anho_limite not necessary?
                "mes_limite": (int(new_invoicing_month["mes"]) + 1) % 12,
                "member": member.num_socio,
                "nombre": member.name,
                "sector": member.sector,
            }
            new_invoicing_month["invoices"].append((invoice))

        serializer = InvoicingMonthSerializer(
            data=new_invoicing_month, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
