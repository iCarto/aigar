from contextlib import nullcontext as does_not_raise

import pytest
from django.db.utils import IntegrityError
from django.forms import ValidationError

from domains.tests import factories


pytestmark = pytest.mark.django_db


def test_correct_name_for_locality_with_sector():
    zone = factories.ZoneFactory.create(
        locality__name=" mi comunidad ", locality__short_name="comUnidad", code="2"
    )
    assert zone.locality.name == "Mi comunidad"
    assert zone.locality_id == "comUnidad"
    assert zone.locality_short_name == "comUnidad"
    assert zone.name == "2 - comUnidad"


def test_correct_name_for_locality_without_sector():
    zone = factories.ZoneFactory.create(
        locality__name=" mi comunidad ", locality__short_name="comUnidad", code=None
    )
    assert zone.locality.name == "Mi comunidad"
    assert zone.locality_id == "comUnidad"
    assert zone.locality_short_name == "comUnidad"
    assert zone.name == "comUnidad"


def test_name_is_unique():
    factories.ZoneFactory.create(locality__name="comunidad", code=None)
    with pytest.raises(
        IntegrityError, match="UNIQUE constraint failed: domains_locality.short_name"
    ):
        factories.ZoneFactory.create(locality__name="comunidad", code=None)


@pytest.mark.parametrize(
    ("reading_day", "expectation"),
    [
        ({"reading_day": -1}, pytest.raises(ValidationError)),
        ({"reading_day": 32}, pytest.raises(ValidationError)),
        ({"reading_day": 15}, does_not_raise()),
    ],
)
def test_reading_day_is_valid(reading_day, expectation):
    with expectation:
        factories.ZoneFactory.create(**reading_day)
