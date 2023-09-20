from rest_framework import viewsets
from rest_framework.generics import ListAPIView

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
