from api.models.invoice import InvoiceStatus
from api.models.member import Sectores
from rest_framework.response import Response
from rest_framework.views import APIView


class DomainsView(APIView):
    def get(self, request, entity, format=None):
        print(entity)
        if entity == "sectores":
            return Response(Sectores.choices)
        if entity == "estados":
            return Response(InvoiceStatus.choices)
