import factory

from back.models.fixed_values import fixed_values
from back.models.invoice import Invoice
from back.models.invoicing_month import InvoicingMonth
from back.models.member import Member, UseTypes
from back.tests.base_factory import BaseFactory
from domains.tests.factories import ZoneFactory


class MemberFactory(BaseFactory[Member]):  # type: ignore
    # num_socio
    name = factory.Faker("name")
    medidor = factory.Faker("numerify", text="######")
    orden = 0
    observaciones = factory.Faker("paragraph")
    consumo_maximo = None
    consumo_reduccion_fija = None
    # created_at = models.DateTimeField(null=True, auto_now_add=True)
    # updated_at = models.DateTimeField(null=True, auto_now=True)
    is_active = True
    personas_acometida = 3
    dui = factory.Faker("numerify", text="########-#")
    sector = factory.SubFactory(ZoneFactory)
    tipo_uso = factory.Faker("random_element", elements=UseTypes.labels)


class InvoicingMonthFactory(BaseFactory[InvoicingMonth]):  # type: ignore
    # class Meta(object):
    #     inline_args = ("anho", "mes")

    # id_mes_facturacion
    anho = 2020
    mes = 9
    is_open = True


class InvoiceFactory(BaseFactory[Invoice]):  # type: ignore
    version = 1
    anho = factory.SelfAttribute("mes_facturacion.anho")
    mes_facturado = factory.SelfAttribute("mes_facturacion.mes")
    # mes_limite = factory.LazyAttribute(lambda obj: obj.mes_facturado + 1)  # fixme
    # anho_limite = factory.LazyAttribute(lambda obj: obj.anho + 1)  # fixme
    mes_limite = "10"
    anho_limite = "2019"
    caudal_anterior = 1390
    caudal_actual = 1400
    consumo = 10
    cuota_fija = fixed_values["CUOTA_FIJA_NORMAL"]
    cuota_variable = 0
    comision = fixed_values["COMISION"]
    ahorro = fixed_values["AHORRO_MANO_DE_OBRA_NORMAL"]
    mora = 0
    derecho = 0
    reconexion = 0
    asamblea = 0
    traspaso = 0
    saldo_pendiente = 0
    descuento = 0
    otros = 0
    total = 6.0
    estado = "nueva"
    observaciones = None
    entrega = False
    pago_1_al_10 = None
    pago_11_al_30 = None
    member = factory.SubFactory(MemberFactory)
    mes_facturacion = factory.SubFactory(InvoicingMonthFactory)
