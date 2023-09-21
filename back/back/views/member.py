from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.response import Response

from back.models.member import Member
from back.serializers.member import (
    MemberExportSerializer,
    MemberSerializer,
    MemberStatusSerializer,
)


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer

    @action(detail=True, methods=["put"])
    def status(self, request, pk=None):
        member = self.get_object()
        serializer = MemberStatusSerializer(data=request.data)
        if serializer.is_valid():
            member.update_status(serializer.validated_data["status"])
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


class MemberExportView(ListAPIView):
    queryset = Member.objects.active().all()
    serializer_class = MemberExportSerializer
