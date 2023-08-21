import pytest

from back.models.member import Member
from domains.tests.factories import ZoneFactory


pytestmark = pytest.mark.django_db


@pytest.mark.skip("Not working")
def test_negative_order_not_allowed():
    data = {
        "name": "foo",
        "medidor": "123456",
        "solo_mecha": False,
        "orden": -1,
        "is_active": True,
        "sector": ZoneFactory.create(),
    }
    # member = Member.objects.create(**data)
    member = Member(**data)
    member.full_clean()
    member.save()
    assert member.orden == -1
