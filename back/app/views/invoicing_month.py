from rest_framework import status, viewsets
from rest_framework.response import Response

from app.models.invoicing_month import InvoicingMonth
from app.serializers.invoicing_month import InvoicingMonthSerializer


class InvoicingMonthViewSet(viewsets.ModelViewSet):
    serializer_class = InvoicingMonthSerializer
    queryset = InvoicingMonth.objects.all()
    lookup_url_kwarg = "mes_facturacion_id"

    def destroy(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
