import factory

from domains.models.locality import Locality
from domains.models.zone import Zone, build_name as build_zone_name
from domains.tests.base_factory import BaseFactory


class LocalityFactory(BaseFactory[Locality]):  # type: ignore
    name = factory.Faker("street_address")
    short_name = factory.LazyAttribute(lambda obj: (obj.name or "")[:13])
    number_of_sectors = 0


class ZoneFactory(BaseFactory[Zone]):  # type: ignore
    locality = factory.SubFactory(LocalityFactory)
    code = None
    name = factory.LazyAttribute(
        lambda obj: build_zone_name(obj.code, obj.locality.short_name)
    )
