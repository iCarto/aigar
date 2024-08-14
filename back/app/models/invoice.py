import datetime
import logging
from decimal import Decimal
from typing import TYPE_CHECKING, Any, Self, cast

from django.core import exceptions
from django.db import models, transaction
from django.db.models.lookups import GreaterThan

from app.models.forthcoming_invoice_item import (
    ForthcomingInvoiceItem,
    ForthcomingInvoiceItemName,
)
from app.models.invoice_status import InvoiceStatus
from app.models.invoice_value import InvoiceValue
from back.utils.dates import next_month
from domains.models import aigar_config


if TYPE_CHECKING:
    from app.models.measurement import Measurement

logger = logging.getLogger(__name__)


def _cuota_fija(member) -> Decimal:
    return cast(
        Decimal, aigar_config.get_invoice_value(InvoiceValue.CUOTA_FIJA, member)
    )


def _comision(member) -> Decimal:
    return cast(Decimal, aigar_config.get_invoice_value(InvoiceValue.COMISION, member))


def _ahorro(member) -> Decimal:
    return cast(Decimal, aigar_config.get_invoice_value(InvoiceValue.AHORRO, member))


def _calculated_forthcomingitem(member, name: ForthcomingInvoiceItemName):
    # Al iterar por .all() en lugar de hacer un .filter no se lanzan nuevas queries
    for item in member.forthcominginvoiceitem_set.all():
        if item.item == name:
            item.delete()
            return item.value
    return 0


def _calculated_reconexion(member) -> float:
    return _calculated_forthcomingitem(member, ForthcomingInvoiceItemName.reconexion)


def _calculated_derecho(member) -> float:
    return _calculated_forthcomingitem(member, ForthcomingInvoiceItemName.derecho)


class InvoiceQuerySet(models.QuerySet["Invoice"]):
    def with_deudadb(self) -> Self:
        return self.alias(
            deudadb=models.ExpressionWrapper(
                models.functions.Coalesce("total", 0)
                - models.F("ontime_payment")
                - models.F("late_payment"),
                output_field=models.FloatField(),
            )
        )

    def with_mora_por_impago(self) -> Self:
        return self.annotate(
            mora_por_impago=GreaterThan(
                models.ExpressionWrapper(
                    models.functions.Coalesce("total", 0)
                    - models.F("ontime_payment")
                    - models.F("late_payment"),
                    output_field=models.FloatField(),
                ),
                0,
            )
        )

    def with_mora_por_retraso(self) -> Self:
        return self.annotate(mora_por_retraso=GreaterThan(models.F("late_payment"), 0))


class InvoiceManager(models.Manager["Invoice"]):
    def get_queryset(self) -> InvoiceQuerySet:
        return InvoiceQuerySet(self.model, using=self._db).exclude(
            estado=InvoiceStatus.ANULADA
        )

    @transaction.atomic
    def create(self, **kwargs: Any) -> "Invoice":
        mes_facturacion = kwargs.get("mes_facturacion", None)
        if mes_facturacion:
            # No viene de de POST /api/invoices/
            return super().create(**kwargs)

        mes_facturacion_id = Invoice.objects.filter(
            mes_facturacion__is_open=True
        ).values_list("mes_facturacion_id", flat=True)[0]
        anho = kwargs.setdefault("anho", mes_facturacion_id[:4])
        mes = kwargs.setdefault("mes", mes_facturacion_id[4:])
        if anho != mes_facturacion_id[:4] or mes != mes_facturacion_id[4:]:
            raise exceptions.ValidationError(
                {
                    exceptions.NON_FIELD_ERRORS: f"El mes no está abierto o no existe. {anho} - {mes}"
                }
            )
        kwargs["mes_facturacion_id"] = mes_facturacion_id
        caudal_anterior = kwargs.setdefault("caudal_anterior", 0)
        kwargs.setdefault("caudal_actual", caudal_anterior)

        latest_invoice = Invoice.objects.filter(member=kwargs["member"]).first()
        if latest_invoice:
            kwargs["mora"] = latest_invoice.calculated_mora()
            kwargs["saldo_pendiente"] = latest_invoice.deuda
            kwargs["reconexion"] = _calculated_reconexion(latest_invoice.member)
        instance = super().create(**kwargs)
        instance.full_clean()
        instance.derecho = _calculated_derecho(instance.member)
        instance.update_total()
        instance.save()
        return instance

    def with_cancelled(self) -> InvoiceQuerySet:
        return InvoiceQuerySet(self.model, using=self._db)

    def member_updated(self, member):
        last_invoice = (
            self.filter(member=member)
            .filter(mes_facturacion__is_open=True)
            .filter(estado=InvoiceStatus.NUEVA)
            .first()
        )
        if last_invoice:
            is_first_invoice = self.filter(member=member).count() == 1
            is_connection_right_invoice = (
                is_first_invoice and not last_invoice.measurement_set.exists()
            )
            # Cuando se crea un nuevo Member y se modifica nada más crearlo, modifica
            # la factura inicial con sólo el derecho de conexión añadiendo más conceptos
            if is_connection_right_invoice:
                return
            last_invoice.update_for_member()

    def build_from(self, member, latest_invoice, new_invoicing_month) -> "Invoice":
        invoice = {
            "anho": new_invoicing_month.anho,
            "mes": new_invoicing_month.mes,
            "member": member,
            "cuota_fija": _cuota_fija(member),
            "comision": aigar_config.get_invoice_value(InvoiceValue.COMISION),
            "ahorro": aigar_config.get_invoice_value(InvoiceValue.AHORRO),
            "caudal_anterior": latest_invoice.caudal_actual,
            "derecho": _calculated_derecho(member),
            "reconexion": _calculated_reconexion(member),
            "mora": latest_invoice.calculated_mora(),
            "saldo_pendiente": latest_invoice.deuda,
            "mes_facturacion": new_invoicing_month,
        }
        return self.model(**invoice)

    def update_state_for(self, invoicing_month) -> None:
        open_invoices = Invoice.objects.filter(
            mes_facturacion=invoicing_month,
            estado__in=[InvoiceStatus.NUEVA, InvoiceStatus.PENDIENTE_DE_COBRO],
        ).with_deudadb()
        open_invoices.filter(deudadb__lte=0).update(estado=InvoiceStatus.COBRADA)
        open_invoices.filter(deudadb__gt=0).update(estado=InvoiceStatus.NO_COBRADA)

    def update_status(self, pks: list[int], status: str) -> None:
        self.filter(id__in=pks).update(estado=status)

    def update_value(self, pks: list[int], invoice_value: InvoiceValue) -> None:
        invoice_value_value = float(aigar_config.get_invoice_value(invoice_value))
        for invoice in self.filter(id__in=pks):
            setattr(invoice, invoice_value.value, invoice_value_value)
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

    def handle_invoices_for_re_active_members(self, member):
        """Gestiona los cambios en la facturación cuando un socio vuelve a activo.

        La deuda que tenga pendiente se incluirá en su nueva factura cuando se creen las
        facturas para el nuevo ciclo buscando cual fue su última factura.

        Se anota en la cola que debe pagar el derecho de reconexión.
        """
        value = getattr(
            aigar_config.get_config(), ForthcomingInvoiceItemName.reconexion
        )
        ForthcomingInvoiceItem.objects.create(
            member=member, item=ForthcomingInvoiceItemName.reconexion, value=value
        )

    def handle_invoices_for_new_members(self, member, d, selected_fee_value=None):
        """Gestiona los cambios en la facturación cuando se crea un nuevo socio.

        Se anota en la cola los pagos que debe realizar por el derecho de conexión.
        """
        if not selected_fee_value:
            return

        first_fee = max(d["primera_cuota"], selected_fee_value)
        remaining_value = d["total"] - first_fee
        cuotas = [first_fee]
        while remaining_value > 0:
            fee_value = min(remaining_value, selected_fee_value)
            cuotas.append(fee_value)
            remaining_value -= fee_value

        ForthcomingInvoiceItem.objects.bulk_create(
            [
                ForthcomingInvoiceItem(
                    item=ForthcomingInvoiceItemName.derecho, value=c, member=member
                )
                for c in cuotas
            ]
        )
        self.create(member=member, version=1, caudal_anterior=0, caudal_actual=0)


_InvoiceManager = InvoiceManager.from_queryset(InvoiceQuerySet)


class Invoice(models.Model):
    class Meta:
        verbose_name = "recibo"
        verbose_name_plural = "recibos"
        ordering = ("-mes_facturacion_id", "-version", "member_id")
        constraints = (
            models.UniqueConstraint(
                name="%(app_label)s_%(class)s_only_one_invoice_per_month_per_member",
                violation_error_message="Un socio/a no puede tener más de dos recibos no anulados en el mismo mes.",
                fields=["mes_facturacion_id", "member_id"],
                condition=~models.Q(estado=InvoiceStatus.ANULADA),
            ),
        )

    member_id: int
    mes_facturacion_id: int
    measurement_set: models.QuerySet["Measurement"]

    objects: InvoiceManager = _InvoiceManager()

    id = models.AutoField(
        primary_key=True,
        verbose_name="Id recibo",
        help_text="El Id del recibo no puede estar vacío y no debe repetirse",
    )

    version = models.PositiveSmallIntegerField(
        null=False, blank=False, default=1, verbose_name="Version", help_text=""
    )

    anho = models.CharField(null=False, blank=False, max_length=4, verbose_name="Año")

    mes = models.CharField(null=False, blank=False, max_length=2, verbose_name="Mes")

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
        null=False,
        blank=False,
        default=0,
        verbose_name="Derecho conexión",
        help_text="Parte del pago (cuota) del derecho de conexión",
    )

    reconexion = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Reconexión", help_text=""
    )

    asamblea = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Inasistencia a Asambleas"
    )

    jornada_trabajo = models.FloatField(
        null=False,
        blank=False,
        default=0,
        verbose_name="Jornadas",
        help_text="Inasistencia a Jornadas de trabajo",
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
        verbose_name="Descuentos",
        help_text="Si el recibo tiene algún descuento especial introduzcalo",
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

    ontime_payment = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Pago en plazo"
    )

    late_payment = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Pago con mora"
    )

    # null debería ser falso pero para evitar problemas con las fixtures
    # https://groups.google.com/forum/#!topic/django-users/Zfqx-kEE2uY
    # https://code.djangoproject.com/ticket/28951
    created_at = models.DateTimeField(null=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, auto_now=True)

    member = models.ForeignKey(
        "Member", null=False, blank=False, on_delete=models.CASCADE
    )

    mes_facturacion = models.ForeignKey(
        "app.InvoicingMonth",
        null=False,
        blank=False,
        on_delete=models.CASCADE,
        editable=False,
    )

    def __str__(self):
        return f"{self.mes_facturacion_id}: {self.member_id} - {self.estado}"

    @property
    def numero(self):
        member_id = str(self.member_id).zfill(4)
        version = str(self.version).zfill(2)
        return f"{member_id}{self.anho}{self.mes}{version}"

    @property
    def due_date(self) -> datetime.date:
        payment_due_day = aigar_config.get_config().payment_due_day
        return next_month(datetime.date(int(self.anho), int(self.mes), payment_due_day))

    @property
    def monto(self) -> float:
        return self.ontime_payment + self.late_payment

    @property
    def deuda(self) -> float:
        return self.total_or0 - self.monto

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

        consumo_tmp = self.consumo
        if self.member.consumo_maximo is not None:
            consumo_tmp = min(self.consumo, self.member.consumo_maximo)

        if self.member.consumo_reduccion_fija:
            consumo_tmp = consumo_tmp - self.member.consumo_reduccion_fija
            if consumo_tmp < 0:
                consumo_tmp = 0

        return consumo_tmp

    def calculated_mora(self) -> Decimal:
        if self.ontime_payment >= self.total_or0:
            return Decimal(0)
        return aigar_config.get_config().recargo_mora

    def update_with_measurement(
        self,
        caudal_actual: int,
        caudal_anterior: int,
        cambio_medidor: bool,  # noqa: FBT001
    ) -> None:
        self.caudal_actual = int(caudal_actual)
        if cambio_medidor:
            self.caudal_anterior = 0
        elif caudal_anterior != int(self.caudal_anterior):
            # Mantenemos el caudal_anterior de la bd, no usamos el de la lectura.
            logger.warning(
                "Caudal anterior: %s distinto a Medida %s para recibo %s",
                self.caudal_anterior,
                caudal_anterior,
                self.id,
            )

        self.update_total()

    def update_total(self):
        if self.consumo is None or self.consumo_final is None:
            return

        if self.member.consumo_reduccion_fija and self.consumo_final == 0:
            self.cuota_fija = 0
            self.comision = 0
            self.ahorro = 0
        self.cuota_variable = self.calculated_variable_fee()

        # TODO(fpuga): Review if store invoice in decimal fields is a better option
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

    def update_for_member(self):
        self.cuota_fija = float(_cuota_fija(self.member))
        self.comision = float(_comision(self.member))
        self.ahorro = float(_ahorro(self.member))
        self.update_total()
        self.save()

    def update_with_payment(self, fecha_pago, monto_pago):
        if fecha_pago <= self.due_date:
            self.ontime_payment = self.ontime_payment + monto_pago
        else:
            self.late_payment = self.late_payment + monto_pago
        if self.deuda <= 0:
            self.estado = InvoiceStatus.COBRADA

    def calculated_variable_fee(self) -> float | None:
        if self.consumo_final is None:
            return None
        stretches = aigar_config.get_config().get_stretches(self.member)
        return calculate_variable_fee(stretches, self.consumo_final)


def calculate_variable_fee(stretches: aigar_config.Stretches, consumo_final) -> float:
    remaining_consumption = consumo_final
    partial_sum = 0
    last_limit = 0
    for stretch in stretches:
        if remaining_consumption <= 0:
            break
        current_limit = stretch["limit"] - last_limit
        consuption = min(current_limit, remaining_consumption)
        partial_sum += consuption * stretch["cost"]
        remaining_consumption -= consuption
        last_limit = stretch["limit"]

    return float(partial_sum)
