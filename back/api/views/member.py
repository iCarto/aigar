from api.models.invoice import Invoice
from api.models.invoicing_month import InvoicingMonth
from api.models.member import Member
from api.serializers.member import MemberExportSerializer, MemberSerializer
from rest_framework import permissions, viewsets
from rest_framework.generics import ListAPIView
from rest_framework.response import Response


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        queryset = Member.objects.all()
        serializer = MemberSerializer(queryset, many=True, context={"request": request})
        return Response(serializer.data)

    # Override destroy method to set Member as inactive
    def destroy(self, request, *args, **kwargs):
        member = self.get_object()
        member.is_active = False
        member.save()
        return Response(
            MemberSerializer(
                context={"request": request}, instance=self.get_object()
            ).data
        )


class MemberExportView(ListAPIView):
    queryset = Member.objects.filter(is_active=True).all()
    serializer_class = MemberExportSerializer

    def get_serializer_context(self):
        context = super(MemberExportView, self).get_serializer_context()

        last_invoicing_month = InvoicingMonth.objects.filter(is_open=True).first()
        last_monthly_invoices = Invoice.objects.prefetch_related("member").filter(
            mes_facturacion=last_invoicing_month
        )

        context.update(
            {"request": self.request, "last_monthly_invoices": last_monthly_invoices}
        )
        return context
