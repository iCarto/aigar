from django.db.models import Max
from django.db.models import Value as V
from django.db.models.functions import Concat

from api.models.invoice import Invoice, fixed_values
from api.models.invoicing_month import InvoicingMonth
from api.models.member import Member
from api.serializers.invoice import InvoiceSerializer
from api.serializers.invoicing_month import (
    InvoicingMonthSerializer,
    InvoicingMonthWithInvoicesSerializer,
)
from rest_framework import status, viewsets
from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView


class InvoicingMonthViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return InvoicingMonth.objects.prefetch_related(
            "invoices", "invoices__member"
        ).all()

    def get_serializer_class(self):
        if self.action == "list":
            return InvoicingMonthSerializer
        return InvoicingMonthWithInvoicesSerializer

    def create(self, request):
        mes = request.data.get("mes")
        anho = request.data.get("anho")

        invoicing_month_to_close_query = InvoicingMonth.objects.filter(is_open=True)
        if invoicing_month_to_close_query.count() > 1:
            return Response(
                {
                    "error": "Existe más de un mes de facturación abierto. Debe revisar este problema."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        invoicing_month_to_close = invoicing_month_to_close_query.first()
        if invoicing_month_to_close is not None:
            invoicing_month_to_close.is_open = False
            invoicing_month_to_close.save()

        id_mes_facturacion = anho + mes
        try:
            invoicing_month = InvoicingMonth.objects.get(pk=id_mes_facturacion)
            if invoicing_month is not None:
                return Response(
                    {"error": "El mes de facturación ya existe"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except:
            pass

        new_invoicing_month = InvoicingMonth()
        new_invoicing_month.id_mes_facturacion = id_mes_facturacion
        new_invoicing_month.mes = mes
        new_invoicing_month.anho = anho
        new_invoicing_month.is_open = True
        new_invoicing_month.save()

        active_members = Member.objects.filter(is_active=True)
        created_invoices = []
        for member in active_members:
            invoice = Invoice()
            invoice.mes_facturacion = new_invoicing_month
            invoice.anho = new_invoicing_month.anho
            invoice.mes_facturado = new_invoicing_month.mes
            # Is mes_limite necessary and anho_limite not necessary?
            invoice.mes_limite = (int(new_invoicing_month.mes) + 1) % 12
            invoice.member = member
            invoice.nombre = member.name
            invoice.sector = member.sector
            invoice.save()
            created_invoices.append((invoice))

        serializer = InvoicingMonthWithInvoicesSerializer(
            instance=new_invoicing_month, context={"request": request}
        )
        return Response(serializer.data)

    # Only received invoices are updated
    # This operation is used when measurements are changed
    def partial_update(self, request, pk):
        try:
            invoicing_month = InvoicingMonth.objects.get(pk=pk)
        except:
            return Response(
                {"error": "El mes de facturación no existe"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not invoicing_month.is_open:
            return Response(
                {
                    "error": "El servicio GET /api/invoicing_month/<year>/<month> sólo funciona sobre el mes de facturación en curso"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        measurement_invoices = request.data.get("invoices")
        invoices_ids = [
            measurement_invoice["id_factura"]
            for measurement_invoice in measurement_invoices
        ]
        invoices = Invoice.objects.filter(id_factura__in=invoices_ids)
        for invoice in invoices:
            measurement_found = [
                measurement_invoice
                for measurement_invoice in measurement_invoices
                if measurement_invoice["id_factura"] == invoice.id_factura
            ]
            measurement = measurement_found[0]
            invoice.caudal_anterior = measurement["caudal_anterior"]
            invoice.caudal_actual = measurement["caudal_actual"]
            invoice.consumo = invoice.caudal_actual - invoice.caudal_anterior
            invoice = invoice.update_consumo_related_fields()
            invoice.save()
        serializer = InvoicingMonthWithInvoicesSerializer(
            instance=invoicing_month,
            context={"request": request, "invoices_ids": invoices_ids},
        )
        return Response(serializer.data)


class InvoicingMonthPreview(ListAPIView):
    def post(self, request, pk):
        try:
            invoicing_month = InvoicingMonth.objects.get(pk=pk)
        except:
            return Response(
                {"error": "El mes de facturación no existe"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not invoicing_month.is_open:
            return Response(
                {
                    "error": "El servicio GET /api/invoicing_month/<year>/<month> sólo funciona sobre el mes de facturación en curso"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        measurement_invoices = request.data.get("invoices")
        invoices_ids = [
            measurement_invoice["id_factura"]
            for measurement_invoice in measurement_invoices
        ]
        invoices = Invoice.objects.filter(id_factura__in=invoices_ids)
        updated_invoices = []
        for invoice in invoices:
            measurement_found = [
                measurement_invoice
                for measurement_invoice in measurement_invoices
                if measurement_invoice["id_factura"] == invoice.id_factura
            ]
            measurement = measurement_found[0]
            invoice.caudal_anterior = measurement["caudal_anterior"]
            invoice.caudal_actual = measurement["caudal_actual"]
            invoice = invoice.update_consumo_related_fields()
            updated_invoices.append(invoice)
        serializer = InvoicingMonthWithInvoicesSerializer(
            instance=invoicing_month,
            context={"request": request, "invoices": updated_invoices},
        )
        return Response(serializer.data)


class InvoicingMonthPreview(ListAPIView):
    def post(self, request, pk):
        try:
            invoicing_month = InvoicingMonth.objects.get(pk=pk)
        except:
            return Response(
                {"error": "El mes de facturación no existe"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not invoicing_month.is_open:
            return Response(
                {
                    "error": "El servicio GET /api/invoicing_month/<year>/<month> sólo funciona sobre el mes de facturación en curso"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        measurement_invoices = request.data.get("invoices")
        invoices_ids = [
            measurement_invoice["id_factura"]
            for measurement_invoice in measurement_invoices
        ]
        invoices = Invoice.objects.filter(id_factura__in=invoices_ids)
        updated_invoices = []
        for invoice in invoices:
            measurement_found = [
                measurement_invoice
                for measurement_invoice in measurement_invoices
                if measurement_invoice["id_factura"] == invoice.id_factura
            ]
            measurement = measurement_found[0]
            invoice.caudal_anterior = measurement["caudal_anterior"]
            invoice.caudal_actual = measurement["caudal_actual"]
            invoice = invoice.update_consumo_related_fields()
            updated_invoices.append(invoice)
        serializer = InvoicingMonthWithInvoicesSerializer(
            instance=invoicing_month,
            context={"request": request, "invoices": updated_invoices},
        )
        return Response(serializer.data)
