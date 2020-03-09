from api.models.member import Member
from api.serializers.member import MemberSerializer
from rest_framework import permissions, viewsets


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    # permission_classes = [permissions.IsAuthenticated]
