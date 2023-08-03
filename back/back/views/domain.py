from rest_framework.generics import ListAPIView
from rest_framework.response import Response

from back.models.invoice import InvoiceStatus


class DomainsView(ListAPIView):
    def get(self, request, entity, format=None):
        if entity == "estados":
            return Response(InvoiceStatus.choices)
