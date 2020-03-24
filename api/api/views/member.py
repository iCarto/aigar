from api.models.member import Member
from api.serializers.member import MemberSerializer
from rest_framework import permissions, viewsets
from rest_framework.response import Response


class MemberViewSet(viewsets.ModelViewSet):
    serializer_class = MemberSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Member.objects.filter(is_active=True).all()

        return queryset

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
