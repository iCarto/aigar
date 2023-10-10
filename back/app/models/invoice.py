import datetime
from typing import Self

from django.db import models

from app.models.fixed_values import fixed_values
from app.models.forthcoming_invoice_item import ForthcomingInvoiceItem
from back.utils.dates import next_month
from domains.models import aigar_config


class InvoiceStatus(models.TextChoices):
    NUEVA = "nueva"  # noqa: WPS115
    PENDIENTE_DE_COBRO = "pendiente_de_cobro"  # noqa: WPS115
    COBRADA = "cobrada"  # noqa: WPS115
    NO_COBRADA = "no_cobrada"  # noqa: WPS115
    ANULADA = "anulada"  # noqa: WPS115


class InvoiceValue(models.TextChoices):
    # name = value, label
    JORNADA_TRABAJO = "jornada_trabajo", "Jornada de trabajo"  # noqa: WPS115
    ASAMBLEA = "asamblea", "Inasistencia a Asamblea"  # noqa: WPS115

    @classmethod
    def from_value(cls, value: str):
        for c in cls:
            if c.value == value:
                return c


def _calculated_reconexion(member) -> float:
    item = member.forthcominginvoiceitem_set.filter(item="DERECHO_RECONEXION").first()
    if item:
        return item.value
    return 0


class InvoiceQuerySet(models.QuerySet["Invoice"]):
    def with_deudadb(self) -> Self:
        return self.alias(
            deudadb=models.ExpressionWrapper(
                models.functions.Coalesce("total", 0)
                - models.functions.Coalesce("pago_1_al_10", 0)
                - models.functions.Coalesce("pago_11_al_30", 0),
                output_field=models.FloatField(),
            )
        )


class InvoiceManager(models.Manager["Invoice"]):
    def get_queryset(self) -> InvoiceQuerySet:
        return InvoiceQuerySet(self.model, using=self._db).exclude(
            estado=InvoiceStatus.ANULADA
        )

    def with_cancelled(self) -> InvoiceQuerySet:
        return InvoiceQuerySet(self.model, using=self._db)

    def member_updated(self, member):
        last_invoice = Invoice.objects.filter(
            member=member, mes_facturacion__is_open=True, estado=InvoiceStatus.NUEVA
        ).first()
        if last_invoice:
            last_invoice.update_total()
            last_invoice.save()

    def create_from(self, member, last_invoice, new_invoicing_month) -> "Invoice":
        invoice = {
            # New monthly invoices are always version 1
            "version": 1,
            "anho": new_invoicing_month.anho,
            "mes_facturado": new_invoicing_month.mes,
            "member": member,
            "cuota_fija": member.cuota_fija,
            "comision": member.comision,
            "ahorro": member.ahorro,
            "caudal_anterior": last_invoice.caudal_actual,
            "derecho": last_invoice.calculated_derecho(),
            "reconexion": _calculated_reconexion(member),
            "mora": last_invoice.calculated_mora(),
            "saldo_pendiente": last_invoice.deuda,
            "mes_facturacion": new_invoicing_month,
        }
        return self.create(**invoice)

    def update_state_for(self, invoicing_month) -> None:
        open_invoices = Invoice.objects.filter(
            mes_facturacion=invoicing_month,
            estado__in=[InvoiceStatus.NUEVA, InvoiceStatus.PENDIENTE_DE_COBRO],
        ).with_deudadb()
        open_invoices.filter(deudadb__lte=0).update(estado=InvoiceStatus.COBRADA)
        open_invoices.filter(deudadb__gt=0).update(estado=InvoiceStatus.NO_COBRADA)

    def update_status(self, pks: list[int], status: str) -> None:
        self.filter(id__in=pks).update(estado=status)

    def update_value(self, pks: list[int], value: str) -> None:
        fix_value = InvoiceValue.from_value(value).name
        for invoice in self.filter(id__in=pks):
            setattr(invoice, value, fixed_values[fix_value])
            invoice.update_total()
            invoice.save()

    def handle_invoices_for_new_deleted_members(self, member):
        """Elimina las facturas en estado NUEVA cuando se borra un socio.

        No toca las demas.
        """
        # En realidad no tendríamos por qué pasar member.
        # Podría ser member__status = MemberStatus.DELETED y este método se podría
        # ejecutar de forma segura en cualquier momento desacomplando la llamada desde
        # member
        # Probablemente tendríamos que gestionar el "saldo_pendiente" de alguna forma
        Invoice.objects.filter(member=member, estado=InvoiceStatus.NUEVA).delete()

    def handle_invoices_for_new_inactive_members(self, member):
        """Nada que hacer por ahora.

        La factura en curso sigue siendo válida y debe ser emitida y pagada (o acabar
        como no cobrada). La deuda pendiente se gestionará si vuelve a Activa.
        """

    def handle_invoices_for_new_active_members(self, member):
        """Gestiona los cambios en la facturación cuando un socio vuelve a activo.

        La deuda que tenga pendiente se incluirá en su nueva factura cuando se creen las
        facturas para el nuevo ciclo buscando cual fue su última factura.

        Se anota en la cola que debe pagar el derecho de reconexión.
        """
        ForthcomingInvoiceItem.objects.create(
            member=member,
            item="DERECHO_RECONEXION",
            value=fixed_values["DERECHO_RECONEXION"],
        )


_InvoiceManager = InvoiceManager.from_queryset(InvoiceQuerySet)


class Invoice(models.Model):
    class Meta(object):
        verbose_name = "factura"
        verbose_name_plural = "facturas"
        ordering = ("id",)

    objects: InvoiceManager = _InvoiceManager()

    id = models.AutoField(
        primary_key=True,
        verbose_name="Id factura",
        help_text="El Identificador de la factura no puede estar vacío y no debe repetirse",
    )

    version = models.PositiveSmallIntegerField(
        null=False, blank=False, unique=False, verbose_name="Version", help_text=""
    )

    anho = models.PositiveSmallIntegerField(
        null=False, blank=False, unique=False, verbose_name="Año", help_text=""
    )

    mes_facturado = models.PositiveSmallIntegerField(
        null=False, blank=False, verbose_name="Mes facturado", help_text=""
    )

    caudal_anterior = models.PositiveIntegerField(
        null=False, blank=False, verbose_name="Caudal anterior"
    )

    caudal_actual = models.PositiveIntegerField(
        null=True, blank=True, verbose_name="Caudal actual"
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

    jornada_trabajo = models.FloatField(
        null=False,
        blank=False,
        default=0,
        verbose_name="Jornada de Trabajo",
        help_text="",
    )

    traspaso = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Traspaso", help_text=""
    )

    saldo_pendiente = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Saldo pendiente", help_text=""
    )

    descuento = models.FloatField(
        null=False,
        blank=False,
        default=0,
        verbose_name="Descuento",
        help_text="Si la factura tiene algún descuento especial introduzcalo",
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
        editable=False,
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

    member = models.ForeignKey(
        "Member",
        null=False,
        blank=False,
        related_query_name="invoice",
        on_delete=models.CASCADE,
    )

    mes_facturacion = models.ForeignKey(
        "InvoicingMonth",
        null=False,
        blank=False,
        related_name="invoices",
        related_query_name="invoice",
        on_delete=models.CASCADE,
        editable=False,
    )

    def __str__(self):
        return f"{self.id} - {self.member} - {self.mes_facturado} - {self.anho} - {self.total} - {self.estado}"

    @property
    def due_date(self) -> datetime.date:
        payment_due_date = aigar_config.get_config().payment_due_day
        return next_month(
            datetime.date(self.anho, self.mes_facturado, payment_due_date)
        )

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

    @property
    def consumo(self) -> int | None:
        if self.caudal_actual is None:
            return None
        return self.caudal_actual - self.caudal_anterior

    @property
    def consumo_final(self) -> int | None:
        if self.consumo is None:
            return None
        if self.member.consumo_maximo is not None:
            consumo_tmp = min(self.consumo, self.member.consumo_maximo)
        else:
            consumo_tmp = self.consumo

        return consumo_tmp - (self.member.consumo_reduccion_fija or 0)

    def update_with_measurement(self, caudal_actual, caudal_anterior):
        self.caudal_actual = int(caudal_actual)
        self.caudal_anterior = (
            caudal_anterior if caudal_anterior is not None else self.caudal_anterior
        )
        self.update_total()

    def update_total(self):
        if self.consumo is None or self.consumo_final is None:
            return

        self.cuota_fija = self.member.cuota_fija
        self.ahorro = self.member.ahorro

        self.cuota_variable = self.calculated_cuota_variable()

        # TODO Review if store invoice in decimal fields is a better option
        self.total = round(
            self.cuota_fija
            + self.cuota_variable
            + self.comision
            + self.ahorro
            + self.mora
            + self.asamblea
            + self.jornada_trabajo
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
        return fixed_values["MORA"] if (self.pago_1_al_10 or 0) == 0 else 0

    def calculated_derecho(self) -> float:
        return fixed_values["DERECHO_CONEXION"]

    def calculated_cuota_variable(self) -> float | None:
        if self.consumo_final is None:
            return None
        if self.consumo_final <= 14:
            return fixed_values["CUOTA_VARIABLE_MENOS_14"] * self.consumo_final
        if 14 < self.consumo_final < 20:
            return (fixed_values["CUOTA_VARIABLE_MENOS_14"] * 14) + fixed_values[
                "CUOTA_VARIABLE_14_20"
            ] * (self.consumo_final - 14)

        return (
            (fixed_values["CUOTA_VARIABLE_MENOS_14"] * 14)
            + (fixed_values["CUOTA_VARIABLE_14_20"] * 6)
            + fixed_values["CUOTA_VARIABLE_MAS_20"] * (self.consumo_final - 20)
        )


class NoLastInvoice(object):
    @property
    def deuda(self) -> float:
        return 0

    @property
    def caudal_actual(self) -> float:
        return 0

    def calculated_derecho(self) -> float:
        return 0

    def calculated_mora(self) -> float:
        return 0
