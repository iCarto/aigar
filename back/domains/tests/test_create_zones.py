import pytest

from domains.exceptions import ConfigError
from domains.models.locality import Locality
from domains.models.zone import Zone


pytestmark = pytest.mark.django_db


def test_one_locality_without_zones():
    Locality.objects.create(
        name="Comunidad número 1", short_name="Com1", number_of_sectors=0
    )
    zones = Zone.objects.all()
    assert len(zones) == 1
    assert zones[0].name == "Com1"


def test_one_locality_with_zones():
    Locality.objects.create(
        name="Comunidad número 1", short_name="Com1", number_of_sectors=2
    )
    zones = Zone.objects.all()
    assert len(zones) == 2
    assert zones[0].name == "1 - Com1"
    assert zones[1].name == "2 - Com1"


def test_two_localities_without_zones():
    Locality.objects.create(
        name="Comunidad número 1", short_name="Com1", number_of_sectors=0
    )
    Locality.objects.create(
        name="Comunidad número 2", short_name="Com2", number_of_sectors=0
    )
    zones = Zone.objects.all()
    assert len(zones) == 2
    assert zones[0].name == "Com1"
    assert zones[1].name == "Com2"


def test_code_independent_from_location_order():
    """Zone's code is indepentend from the order that localities are created.

    It depends only in the alphabetical sort or the short_name
    """
    Locality.objects.create(name="B__", short_name="C__", number_of_sectors=1)
    Locality.objects.create(name="Z__", short_name="A__", number_of_sectors=1)
    zones = Zone.objects.all()
    assert len(zones) == 2
    assert zones[0].name == "1 - A__"
    assert zones[1].name == "2 - C__"


def test_multiple_localities_with_zones():
    Locality.objects.create(
        name="Comunidad número 1", short_name="Com1", number_of_sectors=2
    )
    Locality.objects.create(
        name="Comunidad número 2", short_name="Com2", number_of_sectors=3
    )

    zone_names = list(Zone.objects.values_list("name", flat=True))
    assert len(zone_names) == 5
    assert zone_names == ["1 - Com1", "2 - Com1", "3 - Com2", "4 - Com2", "5 - Com2"]


def test_two_localities_without_zone2s():
    Locality.objects.create(
        name="Comunidad número 1", short_name="Com1", number_of_sectors=0
    )
    with pytest.raises(
        ConfigError,
        match="No puede haber comunidades con 0 sectores y otras con más de 0 a la vez",
    ):
        Locality.objects.create(
            name="Comunidad número 2", short_name="Com2", number_of_sectors=1
        )
