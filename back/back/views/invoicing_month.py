from rest_framework import viewsets

from back.models.invoicing_month import InvoicingMonth
from back.serializers.invoicing_month import InvoicingMonthSerializer


class InvoicingMonthViewSet(viewsets.ModelViewSet):
    serializer_class = InvoicingMonthSerializer
    queryset = InvoicingMonth.objects.all()
