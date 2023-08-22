import pytest

from back.models.member import Member
from back.tests.factories import MemberFactory
from domains.tests.factories import ZoneFactory


@pytest.fixture
def five_members_in_order() -> list[Member]:
    members = [MemberFactory.create(orden=orden) for orden in range(0, 5)]
    for orden in range(0, 5):
        assert members[orden].orden == orden
    return members


@pytest.fixture
def new_member_data() -> dict:
    return {
        "name": "foo",
        "medidor": "123456",
        "solo_mecha": False,
        "orden": 2,
        "observaciones": "",
        "is_active": True,
        "sector": ZoneFactory.create().name,
    }
