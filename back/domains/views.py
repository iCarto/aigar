from rest_framework import viewsets

from domains.models.zone import Zone
from domains.serializers import ZoneSerializer


class ZoneViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint that allows Zones to be viewed or edited."""

    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer
