import pytest

from back.models.member import Member
from back.tests.factories import MemberFactory
from domains.tests.factories import ZoneFactory


pytestmark = pytest.mark.django_db


def test_delete_member(api_client):
    member = MemberFactory.create(is_active=True)
    member_pk = member.pk
    assert member.pk == 1
    assert member.num_socio == 1
    response = api_client.delete(f"/api/members/{member_pk}/")
    assert response.status_code == 204
    expected = Member.objects.get(pk=member_pk)
    assert expected.is_active is False


def test_create_member_first_order(api_client):
    data = {
        "name": "foo",
        "medidor": "123456",
        "solo_mecha": False,
        "orden": 2,
        "observaciones": "",
        "is_active": True,
        "sector": ZoneFactory.create().name,
    }
    api_client.post("/api/members/", data)
    assert Member.objects.all().count() == 1
    assert Member.objects.get(pk=1).orden == 2

    data["orden"] = 0
    api_client.post("/api/members/", data)
    assert Member.objects.all().count() == 2
    assert Member.objects.get(pk=2).orden == 0
    assert Member.objects.get(pk=1).orden == 2  # not need to increase orden


def test_create_member_order_move_others(api_client):
    members = [MemberFactory.create(orden=orden) for orden in range(0, 4)]
    for orden in range(0, 4):
        assert members[orden].orden == orden

    data = {
        "name": "foo",
        "medidor": "123456",
        "solo_mecha": False,
        "orden": 2,
        "observaciones": "",
        # "consumo_maximo": None,
        # "consumo_reduccion_fija": None,
        "is_active": True,
        "sector": members[0].sector_id,
    }
    response = api_client.post("/api/members/", data)
    assert response.status_code == 201
    for member in members:
        member.refresh_from_db()
    members.insert(2, Member.objects.get(pk=5))
    assert [m.orden for m in members] == [0, 1, 2, 3, 4]
