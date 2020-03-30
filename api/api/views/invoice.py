from django.db.models import Max
from django.db.models import Value as V
from django.db.models.functions import Concat

from api.models.invoice import Invoice, fixed_values
from api.serializers.invoice import InvoiceSerializer
from rest_framework import permissions, status, viewsets


class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Invoice.objects.prefetch_related("member").all()
        num_socio = self.request.query_params.get("num_socio", None)
        if num_socio is not None:
            queryset = queryset.filter(member=num_socio)

        year = self.request.query_params.get("year", None)
        month = self.request.query_params.get("month", None)
        if year is not None and month is not None:
            queryset = queryset.filter(anho=int(year), mes_facturado=(int(month)))

        return queryset
