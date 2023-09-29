from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from app.models.invoice import InvoiceStatus
from domains.models.basic_config import BasicConfig
from domains.models.zone import Zone
from domains.serializers import BasicConfigSerializer, ZoneSerializer


TWO_HOURS = 60 * 60 * 2


@method_decorator(cache_page(TWO_HOURS), name="dispatch")
class ZoneViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint that allows Zones to be viewed."""

    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer


@method_decorator(cache_page(TWO_HOURS), name="dispatch")
class BasicConfigViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint that allows BasicConfig to be viewed."""

    queryset = BasicConfig.objects.all()
    serializer_class = BasicConfigSerializer


@api_view(["GET"])
def invoice_status_view(request) -> Response:
    return Response(InvoiceStatus.choices)
