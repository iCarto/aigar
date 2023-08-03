from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from back.models.invoice import InvoiceStatus
from domains.models.zone import Zone
from domains.serializers import ZoneSerializer


class ZoneViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint that allows Zones to be viewed or edited."""

    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer


@api_view(["GET"])
def invoice_status_view(request) -> Response:
    return Response(InvoiceStatus.choices)
