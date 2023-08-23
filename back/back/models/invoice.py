from django.db import models

from back.models.fixed_values import fixed_values
from back.models.invoicing_month import InvoicingMonth
from domains.models.zone import Zone


class InvoiceStatus(models.TextChoices):
    NUEVA = "nueva"
    PENDIENTE_DE_COBRO = "pendiente_de_cobro"
    COBRADA = "cobrada"
    NO_COBRADA = "no_cobrada"
    ANULADA = "anulada"


def _next_month(invoicing_month: InvoicingMonth) -> int:
    month = int(invoicing_month.mes)
    return 1 if month + 1 > 12 else month + 1


def _next_year(invoicing_month: InvoicingMonth) -> int:
    year = int(invoicing_month.anho)
    month = int(invoicing_month.mes)
    return year + 1 if month == 12 else year


class InvoiceManager(models.Manager):
    def member_updated(self, member):
        last_invoice = Invoice.objects.filter(
            member=member,
            mes_facturacion__is_open=True,
            is_active=True,
            estado=InvoiceStatus.NUEVA,
        ).first()
        if last_invoice:
            last_invoice.nombre = member.name
            last_invoice.sector = member.sector
            if last_invoice.caudal_actual is not None:
                last_invoice.update_total()
            last_invoice.save()

    def create_from(self, member, last_invoice, new_invoicing_month):
        invoice = {
            # New monthly invoices are always version 1
            "version": 1,
            "anho": new_invoicing_month.anho,
            "mes_facturado": new_invoicing_month.mes,
            "mes_limite": _next_month(new_invoicing_month),
            "anho_limite": _next_year(new_invoicing_month),
            "member": member,
            "nombre": member.name,
            "sector": member.sector,
            "cuota_fija": member.cuota_fija,
            "comision": member.comision,
            "ahorro": member.ahorro,
            "caudal_anterior": last_invoice.caudal_actual,
            "derecho": last_invoice.calculated_derecho(),
            "reconexion": last_invoice.calculated_reconexion(member),
            "mora": last_invoice.calculated_mora(),
            "saldo_pendiente": last_invoice.deuda,
            "mes_facturacion": new_invoicing_month,
        }
        return self.create(**invoice)


class Invoice(models.Model):
    class Meta(object):
        verbose_name = "factura"
        verbose_name_plural = "facturas"
        ordering = ("id_factura",)

    objects = InvoiceManager()

    id_factura = models.AutoField(
        primary_key=True,
        verbose_name="Id factura",
        help_text="El Identificador de la factura no puede estar vacío y no debe repetirse",
    )

    version = models.PositiveSmallIntegerField(
        null=False, blank=False, unique=False, verbose_name="Version", help_text=""
    )

    nombre = models.CharField(
        max_length=100,
        null=False,
        blank=False,
        unique=False,
        verbose_name="Nombre socio",
        help_text="",
    )

    anho = models.PositiveSmallIntegerField(
        null=False, blank=False, unique=False, verbose_name="Año", help_text=""
    )

    mes_facturado = models.PositiveSmallIntegerField(
        null=False, blank=False, verbose_name="Mes facturado", help_text=""
    )

    mes_limite = models.PositiveSmallIntegerField(
        null=False, blank=False, verbose_name="Mes límite", help_text=""
    )

    anho_limite = models.PositiveSmallIntegerField(
        null=False, blank=False, verbose_name="Año límite", help_text=""
    )

    caudal_anterior = models.PositiveIntegerField(
        null=True, blank=True, verbose_name="Caudal anterior", help_text=""
    )

    caudal_actual = models.PositiveIntegerField(
        null=True, blank=True, verbose_name="Caudal actual", help_text=""
    )

    consumo = models.IntegerField(
        null=True, blank=True, verbose_name="Consumo", help_text=""
    )

    cuota_fija = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Cuota fija", help_text=""
    )

    cuota_variable = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Cuota variable", help_text=""
    )

    comision = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Comisión", help_text=""
    )

    ahorro = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Ahorro", help_text=""
    )

    mora = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Mora", help_text=""
    )

    derecho = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Derecho", help_text=""
    )

    reconexion = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Reconexión", help_text=""
    )

    asamblea = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Asamblea", help_text=""
    )

    traspaso = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Traspaso", help_text=""
    )

    saldo_pendiente = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Saldo pendiente", help_text=""
    )

    descuento = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Descuento", help_text=""
    )

    otros = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Otros", help_text=""
    )

    total = models.FloatField(null=True, blank=True, verbose_name="Total", help_text="")

    estado = models.TextField(
        null=False,
        blank=False,
        choices=InvoiceStatus.choices,
        verbose_name="Estado",
        help_text="",
        default=InvoiceStatus.NUEVA,
    )

    observaciones = models.TextField(
        null=True, blank=True, default="", verbose_name="Observaciones", help_text=""
    )

    entrega = models.BooleanField(
        blank=False, null=False, default=False, verbose_name="Entrega", help_text=""
    )

    pago_1_al_10 = models.FloatField(
        null=True, blank=True, default=0, verbose_name="Pago 1 al 15", help_text=""
    )

    pago_11_al_30 = models.FloatField(
        null=True, blank=True, default=0, verbose_name="Pago 16 al 30", help_text=""
    )

    # null debería ser falso pero para evitar problemas con las fixtures
    # https://groups.google.com/forum/#!topic/django-users/Zfqx-kEE2uY
    # https://code.djangoproject.com/ticket/28951
    created_at = models.DateTimeField(null=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, auto_now=True)

    is_active = models.BooleanField(
        blank=False, null=False, default=True, verbose_name="", help_text=""
    )

    member = models.ForeignKey(
        "Member",
        null=False,
        blank=False,
        related_query_name="invoice",
        on_delete=models.CASCADE,
    )

    mes_facturacion = models.ForeignKey(
        InvoicingMonth,
        null=False,
        blank=False,
        related_name="invoices",
        related_query_name="invoice",
        on_delete=models.CASCADE,
    )

    sector = models.ForeignKey(
        Zone,
        on_delete=models.RESTRICT,
        to_field="name",
        blank=False,
        null=False,
        verbose_name="sector / comunidad",
    )

    def __str__(self):
        return f"{self.id_factura} - {self.member} - {self.nombre} - {self.mes_facturado} - {self.anho} - {self.total} - {self.estado}"

    @property
    def deuda(self) -> float:
        # calculated_saldo_pendiente
        return self.total_or0 - self.monto

    @property
    def monto(self) -> float:
        return (self.pago_1_al_10 or 0) + (self.pago_11_al_30 or 0)

    @property
    def total_or0(self) -> float:
        return self.total or 0

    def update_with_measurement(self, caudal_actual, caudal_anterior):
        self.caudal_actual = int(caudal_actual)
        self.caudal_anterior = (
            caudal_anterior if caudal_anterior is not None else self.caudal_anterior
        )
        self.update_total()

    def update_total(self):
        self.cuota_fija = self.member.cuota_fija
        self.ahorro = self.member.ahorro
        self.consumo = self.caudal_actual - self.caudal_anterior
        consumo_final = (
            min(self.consumo, self.member.consumo_maximo)
            if self.member.consumo_maximo is not None
            else self.consumo
        ) - (self.member.consumo_reduccion_fija or 0)
        self.cuota_variable = self.calculated_cuota_variable(consumo_final)

        # TODO Review if store invoice in decimal fields is a better option
        self.total = round(
            self.cuota_fija
            + self.cuota_variable
            + self.comision
            + self.ahorro
            + self.mora
            + self.asamblea
            + self.derecho
            + self.reconexion
            + self.traspaso
            + self.otros
            + self.saldo_pendiente
            - self.descuento,
            2,
        )

    def update_with_payment(self, fecha_pago, monto_pago):
        if fecha_pago.day < 16:
            self.pago_1_al_10 = self.pago_1_al_10 + monto_pago
        else:
            self.pago_11_al_30 = self.pago_11_al_30 + monto_pago
        if self.monto >= self.total_or0:
            self.estado = InvoiceStatus.COBRADA

    def calculated_mora(self) -> float:
        return 1 if (self.pago_1_al_10 or 0) == 0 else 0

    def calculated_derecho(self) -> float:
        return fixed_values["DERECHO_CONEXION"]

    def calculated_reconexion(self, member) -> float:
        # TODO Comprobar que la factura anterior fue emitida para un socio con solo mecha
        # pero ahora el socio está activo. Nos basamos en el campo de cuota_fija o creamos un nuevo campo?
        if (
            not member.solo_mecha
            and self.cuota_fija == fixed_values["CUOTA_FIJA_SOLO_MECHA"]
        ):
            return 10
        return 0

    def calculated_cuota_variable(self, consumo_final: float) -> float:
        if consumo_final <= 14:
            return fixed_values["CUOTA_VARIABLE_MENOS_14"] * consumo_final
        if 14 < consumo_final < 20:
            return (fixed_values["CUOTA_VARIABLE_MENOS_14"] * 14) + fixed_values[
                "CUOTA_VARIABLE_14_20"
            ] * (consumo_final - 14)

        return (
            (fixed_values["CUOTA_VARIABLE_MENOS_14"] * 14)
            + (fixed_values["CUOTA_VARIABLE_14_20"] * 6)
            + fixed_values["CUOTA_VARIABLE_MAS_20"] * (consumo_final - 20)
        )


class NoLastInvoice(object):
    @property
    def deuda(self) -> float:
        return 0

    @property
    def caudal_actual(self) -> float:
        return 0

    def calculated_derecho(self) -> float:
        return fixed_values["EMPTY_DERECHO_CONEXION"]

    def calculated_mora(self) -> float:
        return 0

    def calculated_reconexion(self, _) -> float:
        return 0
