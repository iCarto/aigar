from decimal import Decimal

import pytest
from django.core import exceptions

from app.models.member import UseTypes
from app.tests.factories import MemberFactory
from domains.models.aigar_config import MAX_LIMIT_VALUE, AigarConfig


pytestmark = pytest.mark.django_db


def test_valid_stretches():
    config = AigarConfig().get_solo()

    config.comercial_cuota_variable_primer_tramo_cantidad = None
    config.comercial_cuota_variable_primer_tramo_coste = Decimal("1")
    stretches = [
        {"limit": 14, "cost": 0},
        {"limit": 20, "cost": 0.75},
        {"limit": None, "cost": 2},
    ]
    tipo_uso = "humano"
    _set_stretches(tipo_uso, stretches, config)

    config.full_clean()
    config.save()
    assert config.humano_cuota_variable_primer_tramo_cantidad == 14
    assert config.humano_cuota_variable_primer_tramo_coste == 0
    assert config.humano_cuota_variable_tercer_tramo_cantidad is None
    assert config.humano_cuota_variable_tercer_tramo_coste == 2


def test_invalid_unordered():
    config = AigarConfig().get_solo()

    config.comercial_cuota_variable_primer_tramo_cantidad = None
    config.comercial_cuota_variable_primer_tramo_coste = Decimal("1")
    stretches = [
        {"limit": 20, "cost": 0},
        {"limit": 5, "cost": 0.75},
        {"limit": None, "cost": 2},
    ]
    tipo_uso = "humano"
    _set_stretches(tipo_uso, stretches, config)

    with pytest.raises(
        exceptions.ValidationError,
        match="Los rangos de la cuota variable no están bien definidos",
    ):
        config.full_clean()


def test_invalid_none():
    config = AigarConfig().get_solo()

    config.comercial_cuota_variable_primer_tramo_cantidad = None
    config.comercial_cuota_variable_primer_tramo_coste = Decimal("1")
    stretches = [
        {"limit": None, "cost": 0},
        {"limit": 5, "cost": 0.75},
        {"limit": None, "cost": 2},
    ]
    tipo_uso = "humano"
    _set_stretches(tipo_uso, stretches, config)

    with pytest.raises(
        exceptions.ValidationError,
        match="No puede haber mezclados valores en blanco en la cuota variable",
    ):
        config.full_clean()


def test_invalid_more_than_one_cost_for_none_limit():
    config = AigarConfig().get_solo()

    _set_stretches(
        "comercial",
        [
            {"limit": None, "cost": 1},
            {"limit": None, "cost": 0},
            {"limit": None, "cost": 0},
        ],
        config,
    )

    config.comercial_cuota_variable_primer_tramo_cantidad = None
    config.comercial_cuota_variable_primer_tramo_coste = Decimal("1")
    stretches = [
        {"limit": 1, "cost": 0},
        {"limit": None, "cost": 0.75},
        {"limit": None, "cost": 2},
    ]
    tipo_uso = "humano"
    _set_stretches(tipo_uso, stretches, config)

    with pytest.raises(
        exceptions.ValidationError,
        match="No puede haber más de un tramo de cuota variable con el límite en blanco y el coste mayor a 0",
    ):
        config.full_clean()


def test_invalid_at_least_one_none():
    config = AigarConfig().get_solo()

    _set_stretches(
        "comercial",
        [
            {"limit": None, "cost": 1},
            {"limit": None, "cost": 0},
            {"limit": None, "cost": 0},
        ],
        config,
    )
    stretches = [
        {"limit": 2, "cost": 0},
        {"limit": 5, "cost": 0.75},
        {"limit": 10, "cost": 2},
    ]
    tipo_uso = "humano"
    _set_stretches(tipo_uso, stretches, config)

    with pytest.raises(
        exceptions.ValidationError,
        match="Debe dejar al menos un tramo con la cantidad en blanco",
    ):
        config.full_clean()


def test_get_stretches_comercial():
    config = AigarConfig().get_solo()
    stretches = [
        {"limit": 5, "cost": 1},
        {"limit": 20, "cost": 0.75},
        {"limit": None, "cost": 2},
    ]
    tipo_uso = "comercial"
    _set_stretches(tipo_uso, stretches, config)

    config.full_clean()
    config.save()
    config.refresh_from_db()

    stretches[2]["limit"] = MAX_LIMIT_VALUE
    assert (
        config.get_stretches(MemberFactory.create(tipo_uso=UseTypes.COMERCIAL))
        == stretches
    )


def _set_stretches(tipo_uso, stretches, config):
    for i, stretch in enumerate(("primer", "segundo", "tercer")):
        setattr(
            config,
            f"{tipo_uso}_cuota_variable_{stretch}_tramo_cantidad",
            stretches[i]["limit"],
        )
        setattr(
            config,
            f"{tipo_uso}_cuota_variable_{stretch}_tramo_coste",
            stretches[i]["cost"],
        )
