import logging
from typing import Any

from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from app.models.invoice import Invoice
from app.models.invoicing_month import InvoicingMonth
from app.models.measurement import Measurement
from app.serializers.invoice import InvoiceSerializer
from app.serializers.measurement import MeasurementSerializer


logger = logging.getLogger(__name__)


class MeasurementViewSet(viewsets.ModelViewSet):
    queryset = Measurement.objects.prefetch_related("invoice").all()
    serializer_class = MeasurementSerializer

    def destroy(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def update(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        measurements: list[dict[str, Any]] = request.data
        invoices = get_invoices_for_measurements(measurements)

        for measurement in measurements:
            invoice = get_invoice_by_member_id(invoices, measurement["member_id"])
            if invoice:
                measurement["invoice"] = invoice.id
            else:
                logger.warning("No hay recibo para la lectura %s", measurement)

        measurements = [m for m in measurements if m["invoice"]]

        serializer = MeasurementSerializer(
            data=measurements, many=True, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"])
    def previewinvoices(self, request):
        measurements = request.data
        invoices = get_invoices_for_measurements(measurements)
        updated_invoices = []
        for measurement in measurements:
            invoice = get_invoice_by_member_id(invoices, measurement["member_id"])
            if invoice:
                invoice.update_with_measurement(
                    measurement["caudal_actual"],
                    measurement["caudal_anterior"],
                    measurement["cambio_medidor"],
                )
                updated_invoices.append(invoice)
        serializer = InvoiceSerializer(
            data=updated_invoices, many=True, context={"request": request}
        )
        serializer.is_valid()
        return Response(serializer.data)


def get_invoices_for_measurements(measurements):
    invoicing_month = get_object_or_404(InvoicingMonth, is_open=True)
    member_id_set = [measurement["member_id"] for measurement in measurements]
    return Invoice.objects.prefetch_related("member").filter(
        member__in=member_id_set, mes_facturacion=invoicing_month
    )


def get_invoice_by_member_id(invoices, member_id):
    invoice = [invoice for invoice in invoices if member_id == invoice.member_id]
    if invoice:
        return invoice[0]
    return None
