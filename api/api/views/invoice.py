from django.db.models import Max
from django.db.models import Value as V
from django.db.models.functions import Concat

from api.models.invoice import Invoice
from api.models.member import Member
from api.serializers.invoice import InvoiceSerializer
from rest_framework import permissions, viewsets
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response


class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Invoice.objects.prefetch_related("member").all()
        num_socio = self.request.query_params.get("num_socio", None)
        if num_socio is not None:
            queryset = queryset.filter(member=num_socio)

        year = self.request.query_params.get("year", None)
        month = self.request.query_params.get("month", None)
        if year is not None and month is not None:
            queryset = queryset.filter(anho=int(year), mes_facturado=(int(month)))

        return queryset


class InvoicingMonthView(ListCreateAPIView):
    def get(self, request, *args, **kwargs):
        open_year_month = str(
            Invoice.objects.aggregate(mes_abierto=Max(Concat("anho", "mes_facturado")))[
                "mes_abierto"
            ]
        )
        return Response(
            {"year": int(open_year_month[:4]), "month": int(open_year_month[4:])}
        )

    def post(self, request, *args, **kwargs):
        active_members = Member.objects.filter(is_active=True)
        month = int(request.data["month"])
        year = int(request.data["year"])
        for member in active_members:
            invoice = Invoice()
            invoice.anho = year
            invoice.mes_facturado = month
            # Is mes_limite necessary and anho_limite not necessary?
            invoice.mes_limite = (month + 1) % 12
            invoice.member = member
            invoice.nombre = member.name
            invoice.sector = member.sector
            invoice.save()
        return Response({"year": year, "month": month})
