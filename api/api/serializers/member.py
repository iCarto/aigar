from api.models import member
from rest_framework import serializers


class MemberSerializer(serializers.HyperlinkedModelSerializer):
    num_socio = serializers.ReadOnlyField()

    class Meta:
        model = member.Member
        fields = "__all__"
