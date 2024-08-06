from typing import Any

from django.db import models, transaction
from django.forms import ValidationError

from app.models.invoice import Invoice
from app.models.invoice_status import InvoiceStatus
from app.models.latest_invoice import LatestInvoice, NoLatestInvoice
from app.models.member import Member
from back.base.base_expressions import JsonGroupArray


def any_payments_for(invoicing_month_to_close):
    from app.models.payment import Payment

    return Payment.objects.filter_by_invoicingmonth(invoicing_month_to_close).exists()


class InvoicingMonthManager(models.Manager["InvoicingMonth"]):
    @transaction.atomic
    def create(self, **kwargs: Any) -> "InvoicingMonth":
        invoicing_month_to_close = InvoicingMonth.objects.get(is_open=True)

        if not any_payments_for(invoicing_month_to_close):
            raise ValidationError(
                "El mes anterior no ha importado ningún pago. Revise si la facturación del mes que va a cerrar está correcta."
            )

        Invoice.objects.update_state_for(invoicing_month_to_close)

        invoicing_month_to_close.is_open = False
        invoicing_month_to_close.save()

        kwargs["is_open"] = True

        new_invoicing_month = super().create(**kwargs)

        self.create_new_invoices(new_invoicing_month)
        return new_invoicing_month

    def get_invoices(self, mes_facturacion_id: str):
        last_three_invoicing_months = (
            InvoicingMonth.objects.filter(id_mes_facturacion__lt=mes_facturacion_id)
            .order_by("-id_mes_facturacion")[:3]
            .values("id_mes_facturacion")
        )

        window_function = models.expressions.Window(
            expression=JsonGroupArray("estado"),
            partition_by="member_id",
            order_by="-mes_facturacion_id",
            frame=models.expressions.RowRange(start=None, end=None),
        )

        q = (
            Invoice.objects.filter(
                mes_facturacion__in=models.expressions.Subquery(
                    last_three_invoicing_months
                )
            )
            .filter(member_id=models.expressions.OuterRef("member_id"))
            .distinct()
            .annotate(foo=window_function)
            .values_list("foo", flat=True)
            .order_by()
        )

        return (
            Invoice.objects.select_related("member")
            .filter(mes_facturacion_id=mes_facturacion_id)
            .annotate(resumen=models.expressions.Subquery(q))
            .order_by("member_id")
        )

    def create_new_invoices(self, new_invoicing_month: "InvoicingMonth"):
        p = models.Prefetch(
            "invoice_set",
            queryset=LatestInvoice.objects.with_cancelled()
            .filter(estado__in=[InvoiceStatus.COBRADA, InvoiceStatus.NO_COBRADA])
            .order_by("id"),
            to_attr="filtered_invoices",
        )
        active_members = Member.objects.active().prefetch_related(
            p, "forthcominginvoiceitem_set"
        )

        invoices_to_create = []
        for member in active_members:
            if member.filtered_invoices:
                last_invoice = member.filtered_invoices[-1]
            else:
                last_invoice = NoLatestInvoice()
            invoices_to_create.append(
                Invoice.objects.build_from(member, last_invoice, new_invoicing_month)
            )
        Invoice.objects.bulk_create(invoices_to_create)


class InvoicingMonth(models.Model):
    class Meta:
        unique_together = (("anho", "mes"),)
        constraints = (
            models.UniqueConstraint(
                name="%(app_label)s_%(class)s_only_one_invoicing_month_open",
                violation_error_message="Existen varios meses de facturación abiertos. Debe revisar este problema.",
                fields=["is_open"],
                condition=models.Q(is_open=True),
            ),
        )
        verbose_name = "mes de facturación"
        verbose_name_plural = "meses de facturación"

    objects: InvoicingMonthManager = InvoicingMonthManager()

    id_mes_facturacion = models.CharField(
        primary_key=True,
        null=False,
        blank=False,
        unique=True,
        verbose_name="Identificador",
        help_text="",
        editable=False,
        max_length=6,
    )

    anho = models.CharField(null=False, blank=False, max_length=4, verbose_name="Año")

    mes = models.CharField(null=False, blank=False, max_length=2, verbose_name="Mes")

    # There will be always one and only one InvoicingMonth open
    is_open = models.BooleanField(
        null=False,
        blank=False,
        editable=False,
        default=True,
        verbose_name="Facturación en curso",
        help_text="",
    )

    # null debería ser falso pero para evitar problemas con las fixtures
    # https://groups.google.com/forum/#!topic/django-users/Zfqx-kEE2uY
    # https://code.djangoproject.com/ticket/28951
    created_at = models.DateTimeField(null=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, auto_now=True)

    def __str__(self):
        return f"{self.anho} - {self.mes} - {self.is_open}"

    def save(self, **kwargs) -> None:
        self.anho = str(self.anho).zfill(4)
        self.mes = str(self.mes).zfill(2)
        self.id_mes_facturacion = f"{self.anho}{self.mes}"

        self.full_clean()
        return super().save(**kwargs)
