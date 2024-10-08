from django.core import exceptions
from django_filters import rest_framework as filters
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from typing_extensions import override

from app.models.invoice import Invoice
from app.models.invoice_status import NOT_MODIFICABLE_INVOICES, InvoiceStatus
from app.serializers.entity_status_serializer import InvoiceStatusSerializer
from app.serializers.invoice import (
    InvoiceSerializer,
    InvoiceStatsSerializer,
    InvoiceValueSerializer,
)
from app.serializers.payment import PaymentSerializer


class InvoiceFilter(filters.FilterSet):
    class Meta:
        model = Invoice
        fields = ("member_id",)


class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = InvoiceFilter
    queryset = Invoice.objects.with_cancelled().select_related(
        "member", "member__sector"
    )

    @action(detail=True, methods=["get"])
    def payments(self, request, pk=None):  # noqa: ARG002
        instance = self.get_object()
        serializer = PaymentSerializer(instance.payment_set.all(), many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["put"])
    def status(self, request):
        serializer = InvoiceStatusSerializer(data=request.data)
        if serializer.is_valid():
            Invoice.objects.update_status(
                serializer.validated_data["pks"], serializer.validated_data["status"]
            )
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["put"])
    def value(self, request):
        serializer = InvoiceValueSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            Invoice.objects.update_value(data["pks"], data["invoice_value"])
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["put"])
    def total(self, request, pk=None):  # noqa: ARG002
        instance = self.get_object()

        def noop_save(*args, **kwargs):  # noqa: ARG001
            """Don't save the instance, just recalculate values and return then."""

        instance.save = noop_save
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        instance.update_total()

        return Response(serializer.data)

    # Override destroy method to set Invoice as inactive and return a new version of the same invoice
    @override
    def destroy(self, request, *args, **kwargs):
        invoice = self.get_object()
        if invoice.estado in NOT_MODIFICABLE_INVOICES:
            msg = f"No se puede modificar un recibo en estado {invoice.estado}"
            raise exceptions.ValidationError(msg)
        if invoice.payment_set.exists():
            msg = "No se puede modificar un recibo con pagos asociados"
            raise exceptions.ValidationError(msg)
        invoice.estado = InvoiceStatus.ANULADA
        invoice.save()
        measurements = list(invoice.measurement_set.all())

        # https://docs.djangoproject.com/en/4.2/topics/db/queries/#copying-model-instances
        invoice.pk = None
        invoice._state.adding = True  # noqa: SLF001
        invoice.version += 1
        invoice.estado = InvoiceStatus.NUEVA
        invoice.save()
        for m in measurements:
            m.invoice = invoice
            m.save()
        return Response(InvoiceSerializer(instance=invoice).data)


class InvoiceStatsView(ListAPIView):
    queryset = (
        Invoice.objects.select_related("member", "mes_facturacion")
        .with_mora_por_impago()
        .with_mora_por_retraso()
    )
    serializer_class = InvoiceStatsSerializer
