from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import mixins, status, viewsets
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework_extensions.mixins import NestedViewSetMixin

from app.exceptions import ClosedMonthException
from app.models.invoice import Invoice
from app.models.invoicing_month import InvoicingMonth
from app.models.measurement import Measurement
from app.serializers.invoice import InvoiceSerializer
from app.serializers.measurement import MeasurementSerializer


class MeasurementViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    NestedViewSetMixin,
    viewsets.GenericViewSet,
):
    queryset = Measurement.objects.prefetch_related("factura").all()
    serializer_class = MeasurementSerializer

    # SQLite performance is slow when we have a lot of insert or update operations
    # Including these operations inside an atomic transaction improves that
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        id_mes_facturacion = self.get_parents_query_dict().get("mes_facturacion", None)
        measurements = request.data

        invoicing_month = get_object_or_404(InvoicingMonth, pk=id_mes_facturacion)
        if not invoicing_month.is_open:
            raise ClosedMonthException()

        invoices = get_invoices_for_measurements(measurements, invoicing_month)

        for measurement in measurements:
            invoice = get_invoice_by_num_socio(invoices, measurement["member_id"])
            measurement["factura"] = invoice.id
            measurement["mes_facturacion"] = id_mes_facturacion

        serializer = MeasurementSerializer(
            data=measurements, many=True, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MeasurementInvoicePreview(CreateAPIView):
    def post(self, request, pk):
        id_mes_facturacion = pk
        measurements = request.data

        invoicing_month = get_object_or_404(InvoicingMonth, pk=id_mes_facturacion)
        if not invoicing_month.is_open:
            raise ClosedMonthException()

        invoices = get_invoices_for_measurements(measurements, invoicing_month)
        updated_invoices = []
        for measurement in measurements:
            invoice = get_invoice_by_num_socio(invoices, measurement["member_id"])
            if invoice is not None:
                invoice.update_with_measurement(
                    measurement["caudal_actual"],
                    measurement["caudal_anterior"]
                    if measurement["cambio_medidor"]
                    else None,
                )
                updated_invoices.append(invoice)
        serializer = InvoiceSerializer(
            data=updated_invoices, many=True, context={"request": request}
        )
        serializer.is_valid()
        return Response(serializer.data)


def get_invoices_for_measurements(measurements, invoicing_month):
    num_socios = [measurement["member_id"] for measurement in measurements]
    return Invoice.objects.prefetch_related("member").filter(
        member__in=num_socios, mes_facturacion=invoicing_month
    )


def get_invoice_by_num_socio(invoices, member_id):
    invoice = [invoice for invoice in invoices if member_id == invoice.member_id]
    if invoice:
        return invoice[0]
    return None
