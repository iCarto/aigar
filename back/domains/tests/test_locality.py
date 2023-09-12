from contextlib import nullcontext as does_not_raise

import pytest
from django.forms import ValidationError

from domains.tests import factories


pytestmark = pytest.mark.django_db


def test_names_must_be_processed_on_create():
    """`name` and `short_name` should be normalized when creating a Locality."""
    locality = factories.LocalityFactory.create(
        name=" mi\r\ncomunidad\nde\tlargo   nombre ", short_name=" la\ncomunidad "
    )
    assert locality.name == "Mi comunidad de largo nombre"
    assert locality.short_name == "La comunidad"


@pytest.mark.skip("Por ahora no está permitido modificar comunidades existentes")
def test_names_must_be_processed_on_update():
    """`name` and `short_name` should be normalized when modifying a Locality."""
    locality = factories.LocalityFactory.create()

    # a borrar. Simplemente chequeo que realmente la factoría está guardando en bd
    assert locality.pk == 1

    locality.name = " mi\r\ncomunidad\nde\tlargo   nombre "
    locality.short_name = " la\ncomunidad "
    locality.save()
    assert locality.name == "Mi comunidad de largo nombre"
    assert locality.short_name == "La comunidad"


@pytest.mark.parametrize(
    "kv,expectation",
    [
        ({"name": None}, pytest.raises(ValidationError)),
        ({"name": ""}, pytest.raises(ValidationError)),
        ({"name": "    "}, pytest.raises(ValidationError)),
        ({"short_name": None}, pytest.raises(ValidationError)),
        ({"short_name": ""}, pytest.raises(ValidationError)),
        ({"short_name": "    "}, pytest.raises(ValidationError)),
        ({"name": "comunidad", "short_name": "comunidad"}, does_not_raise()),
    ],
)
def test_names_are_not_empty(kv, expectation):
    with expectation:
        factories.LocalityFactory.create(**kv)


def test_short_name_max_length_is10():
    locality = factories.LocalityFactory.create(short_name=" la comunidad")
    assert locality.short_name == "La comunidad"
    assert len("La comunidad") == 12

    with pytest.raises(ValidationError):
        factories.LocalityFactory.create(short_name="Largo nombre de comunidad")


def test_names_min_length_is3():
    with pytest.raises(ValidationError):
        factories.LocalityFactory.create(short_name="AA")
    with pytest.raises(ValidationError):
        factories.LocalityFactory.create(name="AA")
