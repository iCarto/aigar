import pytest
from django.db.utils import IntegrityError

from domains.tests import factories


pytestmark = pytest.mark.django_db


def test_correct_name_for_locality_with_sector():
    zone = factories.ZoneFactory.create(
        locality__name=" mi comunidad ", locality__short_name="comunidad", code="2"
    )
    assert zone.locality.name == "Mi comunidad"
    assert zone.locality_id == "Comunidad"
    assert zone.locality_short_name == "Comunidad"
    assert zone.name == "2 - Comunidad"


def test_correct_name_for_locality_without_sector():
    zone = factories.ZoneFactory.create(
        locality__name=" mi comunidad ", locality__short_name="comunidad", code=None
    )
    assert zone.locality.name == "Mi comunidad"
    assert zone.locality_id == "Comunidad"
    assert zone.locality_short_name == "Comunidad"
    assert zone.name == "Comunidad"


def test_name_is_unique():
    factories.ZoneFactory.create(locality__name="comunidad", code=None)
    with pytest.raises(
        IntegrityError, match="UNIQUE constraint failed: domains_locality.short_name"
    ):
        factories.ZoneFactory.create(locality__name="comunidad", code=None)
