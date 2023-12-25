from rest_framework.decorators import api_view
from rest_framework.response import Response

from app.models.member import Member
from app.serializers.member import MemberExportSerializer
from domains.models import aigar_config
from domains.serializers import AigarConfigSerializer


@api_view(["GET"])
def members_export(_):
    members = Member.objects.active().all()
    meta = aigar_config.get_config()
    return Response(
        {
            "members": MemberExportSerializer(members, many=True).data,
            "meta": AigarConfigSerializer(meta).data,
        },
    )
