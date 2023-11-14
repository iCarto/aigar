from rest_framework.decorators import api_view
from rest_framework.response import Response

from app.models.member import Member
from app.serializers.member import MemberExportSerializer
from domains.models import aigar_config
from domains.serializers import AigarConfigSerializer


# class MemberExportSerializerV1(serializers.ModelSerializer):
#     class Meta(object):
#         model = Member
#         fields = [
#             "name",
#             "id",
#             "num_socio",
#             "orden",
#             "sector",
#             "lectura_anterior",
#             "lectura",
#             "consumo_calculado",
#             "tarifa_calculada",
#             "medidor",
#             "cambio_medidor",
#             "cuota_fija",
#             "comision",
#             "ahorro",
#         ]

#     num_socio = serializers.ReadOnlyField(source="id")
#     lectura = serializers.ReadOnlyField(default=None)
#     consumo_calculado = serializers.ReadOnlyField(default=None)
#     tarifa_calculada = serializers.ReadOnlyField(default=None)
#     cambio_medidor = serializers.ReadOnlyField(default=False)

#     lectura_anterior = serializers.ReadOnlyField(source="caudal_anterior")
#     cuota_fija = serializers.ReadOnlyField(default=5.72)
#     comision = serializers.ReadOnlyField(default=0.28)
#     ahorro = serializers.ReadOnlyField(default=0.25)


@api_view(["GET"])
def members_export(_):
    members = Member.objects.active().all()
    meta = aigar_config.get_config()
    return Response(
        {
            "members": MemberExportSerializer(members, many=True).data,
            "meta": AigarConfigSerializer(meta).data,
        }
    )
