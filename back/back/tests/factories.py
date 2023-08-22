import factory

from back.models.invoice import Invoice
from back.models.invoicing_month import InvoicingMonth
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


class InvoicingMonthFactory(BaseFactory[InvoicingMonth]):  # type: ignore
    # class Meta(object):
    #     inline_args = ("anho", "mes")

    # id_mes_facturacion
    anho = 2020
    mes = 9
    is_open = True


class InvoiceFactory(BaseFactory[Invoice]):  # type: ignore
    version = 1
    nombre = factory.SelfAttribute("member.name")
    anho = factory.SelfAttribute("mes_facturacion.anho")
    mes_facturado = factory.SelfAttribute("mes_facturacion.mes")
    mes_limite = factory.LazyAttribute(lambda obj: obj.mes_facturado + 1)  # fixme
    anho_limite = factory.LazyAttribute(lambda obj: obj.anho + 1)  # fixme
    caudal_anterior = 1390
    caudal_actual = 1402
    consumo = 12
    cuota_fija = 5.72
    cuota_variable = 0
    comision = 0.28
    ahorro = 0.25
    mora = 1.0
    derecho = 0
    reconexion = 0
    asamblea = 0
    traspaso = 0
    saldo_pendiente = 8.75
    descuento = 0
    otros = 0
    total = 16
    estado = "nueva"
    observaciones = None
    entrega = False
    pago_1_al_10 = None
    pago_11_al_30 = None
    is_active = True
    member = factory.SubFactory(MemberFactory)
    mes_facturacion = factory.SubFactory(InvoicingMonthFactory)
    sector = factory.SelfAttribute("member.sector")
