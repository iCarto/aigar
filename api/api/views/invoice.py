from api.models.invoice import Invoice
from api.serializers.invoice import InvoiceSerializer
from rest_framework import permissions, viewsets


class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Invoice.objects.all()
        num_socio = self.request.query_params.get("num_socio", None)
        if num_socio is not None:
            queryset = queryset.filter(num_socio=num_socio)

        return queryset
