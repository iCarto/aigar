from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from app.models.member import Member
from app.serializers.entity_status_serializer import MemberStatusSerializer
from app.serializers.member import MemberExportSerializerV1, MemberSerializer


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer

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


class MemberExportViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Member.objects.active().all()
    serializer_class = MemberExportSerializerV1

    def list(self, request):  # noqa: WPS612
        return super().list(request)

    def retrieve(self, request, pk=None):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
