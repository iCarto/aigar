from api.models.member import Member
from rest_framework import serializers


class MemberSerializer(serializers.HyperlinkedModelSerializer):
    num_socio = serializers.ReadOnlyField()

    class Meta:
        model = Member
        fields = "__all__"


class MemberShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = [
            "num_socio",
            "name",
            "sector",
            "solo_mecha",
            "consumo_maximo",
            "consumo_reduccion_fija",
        ]
