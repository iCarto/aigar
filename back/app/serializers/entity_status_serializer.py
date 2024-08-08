from rest_framework import serializers

from app.models.invoice_status import InvoiceStatus
from domains.models.member_status import MemberStatus


class MemberStatusSerializer(serializers.Serializer):
    pks = serializers.ListField(
        child=serializers.IntegerField(), allow_empty=False, required=True, min_length=1
    )
    status = serializers.ChoiceField(
        choices=MemberStatus, allow_blank=False, required=True
    )


class InvoiceStatusSerializer(serializers.Serializer):
    pks = serializers.ListField(
        child=serializers.IntegerField(), allow_empty=False, required=True, min_length=1
    )
    status = serializers.ChoiceField(
        choices=InvoiceStatus, allow_blank=False, required=True
    )
