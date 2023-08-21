from rest_framework import viewsets
from rest_framework.generics import ListAPIView

from back.models.invoice import Invoice
from back.models.invoicing_month import InvoicingMonth
from back.models.member import Member
from back.serializers.member import MemberExportSerializer, MemberSerializer


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer

    def perform_destroy(self, instance):
        instance.inactive()


class MemberExportView(ListAPIView):
    queryset = Member.objects.filter(is_active=True).all()
    serializer_class = MemberExportSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()

        last_invoicing_month = InvoicingMonth.objects.filter(is_open=True).first()
        last_monthly_invoices = Invoice.objects.prefetch_related("member").filter(
            mes_facturacion=last_invoicing_month
        )

        context.update(
            {"request": self.request, "last_monthly_invoices": last_monthly_invoices}
        )
        return context
