from rest_framework import serializers, status, viewsets
from rest_framework.response import Response

from app.models.payment import Payment
from app.serializers.payment import PaymentSerializer


class InvoicingMonthListPaymentsSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Payment
        fields = "__all__"


class InvoicingMonthListPaymentsViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer

    def destroy(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def retrieve(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def list(self, request, *args, **kwargs):
        # Uses get_serializer(..., many=True) by default
        return super().list(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers,
        )

    # def create(self, request, *args, **kwargs):
    #     return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def get_queryset(self):
        mes_facturacion_id = self.kwargs["mes_facturacion_id"]
        return Payment.objects.filter_by_invoicingmonth(mes_facturacion_id).all()
