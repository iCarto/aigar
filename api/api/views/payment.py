from api.models.invoice import Invoice
from api.models.invoicing_month import InvoicingMonth
from api.models.payment import Payment
from api.serializers.payment import PaymentSerializer
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework_extensions.mixins import NestedViewSetMixin


class PaymentViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    NestedViewSetMixin,
    viewsets.GenericViewSet,
):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    # To create payments through /invocingmonth/<id>/payments
    # https://stackoverflow.com/questions/35879857/check-permissions-on-a-related-object-in-django-rest-framework
    def create(self, request, *args, **kwargs):
        if self.get_parents_query_dict().get("mes_facturacion", None) is None:
            return Response(
                {
                    "error": "La operación solo está permitida a través de la url POST /invocingmonths/<id>/payments."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_payments = request.data
        for new_payment in new_payments:
            new_payment["mes_facturacion"] = self.get_parents_query_dict().get(
                "mes_facturacion"
            )

        serializer = PaymentSerializer(
            data=new_payments, many=True, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
