import pytest

from back.models.member import Member
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
        "sector": ZoneFactory.create(),
    }
    member = Member(**data)
    member.full_clean()
    member.save()
    assert member.orden == -1
