from django.db import transaction
from rest_framework import viewsets
from rest_framework.generics import ListAPIView

from back.models.member import Member
from back.serializers.member import MemberExportSerializer, MemberSerializer


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer

    @transaction.atomic
    def perform_create(self, serializer):
        Member.objects.update_orden(
            new_order=serializer.validated_data["orden"], old_order=None
        )
        super().perform_create(serializer)

    @transaction.atomic
    def perform_update(self, serializer):
        Member.objects.update_orden(
            new_order=serializer.validated_data["orden"],
            old_order=serializer.instance.orden,
        )
        super().perform_update(serializer)

    def perform_destroy(self, instance):
        instance.inactive()


class MemberExportView(ListAPIView):
    queryset = Member.objects.filter(is_active=True).all()
    serializer_class = MemberExportSerializer
