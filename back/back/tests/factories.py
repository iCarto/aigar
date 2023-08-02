import factory

from back.models.member import Member
from back.tests.base_factory import BaseFactory
from domains.tests.factories import ZoneFactory


class MemberFactory(BaseFactory[Member]):  # type: ignore
    # num_socio
    name = factory.Faker("name")
    sector = factory.SubFactory(ZoneFactory)
    medidor = factory.Faker("numerify", text="######")
    solo_mecha = False
    orden = 0
    observaciones = factory.Faker("paragraph")
    consumo_maximo = None
    consumo_reduccion_fija = None
    # created_at = models.DateTimeField(null=True, auto_now_add=True)
    # updated_at = models.DateTimeField(null=True, auto_now=True)
    is_active = True
