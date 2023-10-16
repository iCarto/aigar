import factory

from app.models.fixed_values import fixed_values
from app.models.invoice import Invoice
from app.models.invoicing_month import InvoicingMonth
from app.models.member import Member, UseTypes
from app.tests.base_factory import BaseFactory
from domains.models.member_status import MemberStatus
from domains.tests.factories import ZoneFactory


class MemberFactory(BaseFactory[Member]):  # type: ignore
    name = factory.Faker("name")
    medidor = factory.Faker("numerify", text="######")
    orden = 0
    observaciones = factory.Faker("paragraph")
    consumo_maximo = None
    consumo_reduccion_fija = None
    # created_at = models.DateTimeField(null=True, auto_now_add=True)
    # updated_at = models.DateTimeField(null=True, auto_now=True)
    personas_acometida = 3
    dui = factory.Faker("numerify", text="########-#")
    sector = factory.SubFactory(ZoneFactory)
    tipo_uso = factory.Faker("random_element", elements=UseTypes.labels)
    status = MemberStatus.ACTIVE


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
    caudal_anterior = 1390
    caudal_actual = 1400
    cuota_fija = fixed_values["CUOTA_FIJA_NORMAL"]
    cuota_variable = 0
    comision = fixed_values["COMISION"]
    ahorro = fixed_values["AHORRO_MANO_DE_OBRA_NORMAL"]
    mora = 0
    derecho = 0
    reconexion = 0
    asamblea = 0
    jornada_trabajo = 0
    traspaso = 0
    saldo_pendiente = 0
    descuento = 0
    otros = 0
    total = 6.25
    estado = "nueva"
    observaciones = None
    entrega = False
    ontime_payment = None
    late_payment = None
    member = factory.SubFactory(MemberFactory)
    mes_facturacion = factory.SubFactory(InvoicingMonthFactory)
