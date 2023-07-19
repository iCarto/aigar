from back.models.invoice import InvoiceStatus
from back.models.member import Sectores
from rest_framework.generics import ListAPIView
from rest_framework.response import Response


class DomainsView(ListAPIView):
    def get(self, request, entity, format=None):
        if entity == "sectores":
            return Response(Sectores.choices)
        if entity == "estados":
            return Response(InvoiceStatus.choices)
