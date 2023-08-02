import pytest
from django.db.models.deletion import RestrictedError

from back.models.member import Member
from back.tests.factories import MemberFactory
from domains.models.locality import Locality
from domains.models.zone import Zone
from domains.tests.factories import ZoneFactory


pytestmark = pytest.mark.django_db


def test_remove_zone_with_members():
    """Zone that have members assigned can not be removed."""
    member = MemberFactory.create()

    member_pk = member.pk
    zone_pk = member.sector.pk
    locality_pk = member.sector.locality.pk
    assert member_pk > 0
    assert zone_pk > 0
    assert locality_pk > 0

    with pytest.raises(
        RestrictedError,
        match="Cannot delete some instances of model 'Zone' because they are referenced through restricted foreign keys: 'Member.sector'.",
    ):
        Zone.objects.get(pk=zone_pk).delete()

    Member.objects.get(pk=member_pk)
    Zone.objects.get(pk=zone_pk)
    Locality.objects.get(pk=locality_pk)


def test_remove_zone_without_members():
    """Zone that does not have members assigned can be removed."""
    zone = ZoneFactory.create()
    zone_pk = zone.pk
    locality_pk = zone.locality.pk
    assert zone_pk > 0
    assert locality_pk > 0
    Zone.objects.get(pk=zone_pk).delete()
    assert Locality.objects.get(pk=locality_pk).pk == locality_pk
    with pytest.raises(Zone.DoesNotExist):
        assert Zone.objects.get(pk=zone_pk)


def test_remove_locality_with_members():
    """Locality that have members assigned can not be removed."""
    member = MemberFactory.create()

    member_pk = member.pk
    zone_pk = member.sector.pk
    locality_pk = member.sector.locality.pk
    assert member_pk > 0
    assert zone_pk > 0
    assert locality_pk > 0

    with pytest.raises(
        RestrictedError,
        match="Cannot delete some instances of model 'Locality' because they are referenced through restricted foreign keys: 'Member.sector'.",
    ):
        Locality.objects.get(pk=locality_pk).delete()

    Member.objects.get(pk=member_pk)
    Zone.objects.get(pk=zone_pk)
    Locality.objects.get(pk=locality_pk)


def test_remove_locality_without_members():
    """Locality that does not have members assigned can be removed.

    And the associtated zones are also removed.
    """
    zone = ZoneFactory.create()
    zone_pk = zone.pk
    locality_pk = zone.locality.pk
    assert zone_pk > 0
    assert locality_pk > 0
    Locality.objects.get(pk=locality_pk).delete()
    with pytest.raises(Locality.DoesNotExist):
        assert Locality.objects.get(pk=locality_pk)
    with pytest.raises(Zone.DoesNotExist):
        assert Zone.objects.get(pk=zone_pk)
