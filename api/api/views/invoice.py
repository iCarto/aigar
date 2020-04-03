from django.db.models import Max
from django.db.models import Value as V
from django.db.models.functions import Concat

from api.models.invoice import Invoice, fixed_values
from api.models.invoicing_month import InvoicingMonth
from api.serializers.invoice import InvoiceSerializer
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework_extensions.mixins import ListUpdateModelMixin, NestedViewSetMixin


class InvoiceViewSet(ListUpdateModelMixin, NestedViewSetMixin, viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Invoice.objects.prefetch_related("member").all()
        num_socio = self.request.query_params.get("num_socio", None)
        if num_socio is not None:
            queryset = queryset.filter(member=num_socio)

        return self.filter_queryset_by_parents_lookups(queryset)
