import factory

from app.tests.base_factory import BaseFactory
from domains.models.aigar_config import STRETCHES_IDS, AigarConfig, get_config
from domains.models.locality import Locality
from domains.models.zone import Zone, build_name as build_zone_name


class LocalityFactory(BaseFactory[Locality]):
    name = factory.Faker("street_address")
    short_name = factory.LazyAttribute(lambda obj: (obj.name or "")[:13])
    number_of_sectors = 0
    with_zones = False


class ZoneFactory(BaseFactory[Zone]):
    locality = factory.SubFactory(LocalityFactory)
    code = None
    name = factory.LazyAttribute(
        lambda obj: build_zone_name(obj.code, obj.locality.short_name)
    )
    reading_day = factory.Faker("day_of_month")


def _set_stretches(tipo_uso, stretches, config):
    for i, stretch in enumerate(STRETCHES_IDS):
        if len(stretches) <= i:
            break
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


def _set_unused_stretch(tipo_uso, config):
    _set_stretches(
        tipo_uso,
        [
            {"limit": None, "cost": 1},
            {"limit": None, "cost": 0},
            {"limit": None, "cost": 0},
            {"limit": None, "cost": 0},
            {"limit": None, "cost": 0},
            {"limit": None, "cost": 0},
            {"limit": None, "cost": 0},
            {"limit": None, "cost": 0},
        ],
        config,
    )


def get_aigar_config():
    config = AigarConfig().get_solo()
    _set_unused_stretch("comercial", config)
    stretches = [
        {"limit": 14, "cost": 0},
        {"limit": 20, "cost": 0.75},
        {"limit": None, "cost": 2},
        {"limit": None, "cost": 0},
    ]
    _set_stretches("humano", stretches, config)
    defaults = {
        "comision": 0.28,
        "ahorro": 0.25,
        "humano_cuota_fija": 5.72,
        "comercial_cuota_fija": 5.72,
    }
    for key, value in defaults.items():
        setattr(config, key, value)

    config.save()
    return get_config(reload=True)
