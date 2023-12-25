import pytest
from django.forms import ValidationError

from domains.models.zone import Zone
from domains.tests.factories import LocalityFactory


pytestmark = pytest.mark.django_db


def test_one_locality_without_zones():
    LocalityFactory.create(
        name="Comunidad número 1",
        short_name="Com1",
        number_of_sectors=0,
        with_zones=True,
    )
    zones = Zone.objects.all()
    assert len(zones) == 1
    assert zones[0].name == "Com1"


def test_one_locality_with_zones():
    LocalityFactory.create(
        name="Comunidad número 1",
        short_name="Com1",
        number_of_sectors=2,
        with_zones=True,
    )

    zones = Zone.objects.all()
    assert len(zones) == 2
    assert zones[0].name == "1 - Com1"
    assert zones[1].name == "2 - Com1"


def test_two_localities_without_zones():
    LocalityFactory.create(
        name="Comunidad número 1",
        short_name="Com1",
        number_of_sectors=0,
        with_zones=True,
    )
    LocalityFactory.create(
        name="Comunidad número 2",
        short_name="Com2",
        number_of_sectors=0,
        with_zones=True,
    )

    zones = Zone.objects.all()
    assert len(zones) == 2
    assert zones[0].name == "Com1"
    assert zones[1].name == "Com2"


def test_code_independent_from_location_order():
    """Zone's code is indepentend from the order that localities are created.

    It depends only in the alphabetical sort or the short_name
    """
    LocalityFactory.create(
        name="B__", short_name="C__", number_of_sectors=1, with_zones=True,
    )
    LocalityFactory.create(
        name="Z__", short_name="A__", number_of_sectors=1, with_zones=True,
    )

    zones = Zone.objects.all()
    assert len(zones) == 2
    assert zones[0].name == "1 - A__"
    assert zones[1].name == "2 - C__"


def test_multiple_localities_with_zones():
    LocalityFactory.create(
        name="Comunidad número 1",
        short_name="Com1",
        number_of_sectors=2,
        with_zones=True,
    )
    LocalityFactory.create(
        name="Comunidad número 2",
        short_name="Com2",
        number_of_sectors=3,
        with_zones=True,
    )
    zone_names = list(Zone.objects.values_list("name", flat=True))
    assert len(zone_names) == 5
    assert zone_names == ["1 - Com1", "2 - Com1", "3 - Com2", "4 - Com2", "5 - Com2"]


def test_two_localities_without_zone2s():
    LocalityFactory.create(
        name="Comunidad número 1",
        short_name="Com1",
        number_of_sectors=0,
        with_zones=True,
    )
    with pytest.raises(
        ValidationError,
        match="No puede haber comunidades con 0 sectores y otras con más de 0 a la vez",
    ):
        LocalityFactory.create(
            name="Comunidad número 2",
            short_name="Com2",
            number_of_sectors=1,
            with_zones=True,
        ).full_clean()
