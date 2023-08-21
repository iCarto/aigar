import pytest

from back.models.member import Member
from back.tests.factories import MemberFactory


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
