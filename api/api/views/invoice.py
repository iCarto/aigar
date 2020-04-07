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

        # For PATCH bulk operations
        # https://github.com/chibisov/drf-extensions/blob/503c22f8b442b2bff1f9060c58c024d7d4caabf2/rest_framework_extensions/bulk_operations/mixins.py#L60
        id_facturas = self.request.query_params.get("id_facturas", None)
        if id_facturas is not None:
            queryset = queryset.filter(id_factura__in=id_facturas.split(","))

        return self.filter_queryset_by_parents_lookups(queryset)
