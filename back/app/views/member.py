from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.serializers import BaseSerializer

from app.models.member import Member
from app.serializers.entity_status_serializer import MemberStatusSerializer
from app.serializers.member import MemberCreateSerializer, MemberSerializer


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()

    def get_serializer_class(self) -> type[BaseSerializer]:
        if self.action == "create":
            return MemberCreateSerializer
        return MemberSerializer

    @action(detail=False, methods=["put"])
    def status(self, request):
        serializer = MemberStatusSerializer(data=request.data)
        if serializer.is_valid():
            Member.objects.update_status(
                serializer.validated_data["pks"], serializer.validated_data["status"]
            )
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
