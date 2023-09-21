import pytest
from django.core import exceptions

from back.models.member import Member
from back.tests.factories import MemberFactory
from domains.models.member_status import MemberStatus
from domains.tests.factories import ZoneFactory


pytestmark = pytest.mark.django_db


@pytest.mark.skip("Not working")
def test_negative_order_not_allowed():
    data = {
        "name": "foo",
        "medidor": "123456",
        "orden": -1,
        "status": MemberStatus.ACTIVE,
        "tipo_uso": "Humano",
        "sector": ZoneFactory.create(),
    }
    member = Member(**data)
    member.full_clean()
    member.save()
    assert member.orden == -1


def test_none_order_only_allowed_for_deleted():
    member = MemberFactory.create(orden=1, status=MemberStatus.ACTIVE)
    member.orden = None
    with pytest.raises(
        exceptions.ValidationError,
        match="El campo orden sólo puede ser nulo para socias eliminadas",
    ):
        member.save()
    member.status = MemberStatus.DELETED
    member.save()
    assert member.status == MemberStatus.DELETED
    assert member.orden is None
