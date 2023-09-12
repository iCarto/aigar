from contextlib import nullcontext as does_not_raise

import pytest
from django.db.utils import IntegrityError
from django.forms import ValidationError

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


@pytest.mark.parametrize(
    "measuring_day, expectation",
    [
        ({"measuring_day": -1}, pytest.raises(ValidationError)),
        ({"measuring_day": 32}, pytest.raises(ValidationError)),
        ({"measuring_day": 15}, does_not_raise()),
    ],
)
def test_measuring_day_is_valid(measuring_day, expectation):
    with expectation:
        factories.ZoneFactory.create(**measuring_day)
