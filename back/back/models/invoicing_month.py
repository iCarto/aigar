from typing import Any

from django.db import models, transaction
from django.forms import ValidationError

from back.models.invoice import Invoice, InvoiceStatus, NoLastInvoice
from back.models.member import Member
from back.models.payment import Payment


class InvoicingMonthManager(models.Manager):
    @transaction.atomic
    def create(self, **kwargs: Any) -> "InvoicingMonth":
        invoicing_month_to_close = InvoicingMonth.objects.get(is_open=True)

        if not Payment.objects.filter(
            mes_facturacion=invoicing_month_to_close
        ).exists():
            raise ValidationError(
                "El mes anterior no ha importado ningún pago. Revise si la facturación del mes que va a cerrar está correcta."
            )

        last_month_open_invoices = Invoice.objects.filter(
            mes_facturacion=invoicing_month_to_close,
            estado__in=[InvoiceStatus.NUEVA, InvoiceStatus.PENDIENTE_DE_COBRO],
        )

        for last_month_invoice in last_month_open_invoices:
            if last_month_invoice.deuda <= 0:
                last_month_invoice.estado = InvoiceStatus.COBRADA
            else:
                last_month_invoice.estado = InvoiceStatus.NO_COBRADA
            last_month_invoice.save()

        invoicing_month_to_close.is_open = False
        invoicing_month_to_close.save()

        kwargs["id_mes_facturacion"] = kwargs["anho"] + kwargs["mes"]

        # Just ensure that invoices are not set in the payload. It should be checked at
        # frontend and remove this sanity check.
        kwargs.pop("invoices", None)
        instance = super().create(**kwargs)

        active_members = Member.objects.filter(is_active=True)

        last_month_invoices = (
            Invoice.objects.prefetch_related("member")
            .filter(member__in=active_members, mes_facturacion=invoicing_month_to_close)
            .exclude(estado=InvoiceStatus.ANULADA)
        )
        for member in active_members:
            last_invoice = [
                invoice for invoice in last_month_invoices if invoice.member == member
            ]
            last_invoice = last_invoice[0] if last_invoice else NoLastInvoice()
            Invoice.objects.create_from(member, last_invoice, instance)
        return instance


class InvoicingMonth(models.Model):
    class Meta(object):
        unique_together = (("anho", "mes"),)
        constraints = [
            models.UniqueConstraint(
                name="%(app_label)s_%(class)s_only_one_invoicing_month_open",  # noqa: WPS323
                violation_error_message="Existen varios meses de facturación abiertos. Debe revisar este problema.",
                fields=["is_open"],
                condition=models.Q(is_open=True),
            )
        ]

    objects = InvoicingMonthManager()

    id_mes_facturacion = models.TextField(
        primary_key=True,
        null=False,
        blank=False,
        unique=True,
        verbose_name="Identificador",
        help_text="",
        editable=False,
    )

    anho = models.TextField(
        null=False, blank=False, unique=False, verbose_name="Año", help_text=""
    )

    mes = models.TextField(null=False, blank=False, verbose_name="Mes", help_text="")

    # There will be always one and only one InvoicingMonth open
    is_open = models.BooleanField(
        null=False, blank=False, default=True, verbose_name="Mes", help_text=""
    )

    # null debería ser falso pero para evitar problemas con las fixtures
    # https://groups.google.com/forum/#!topic/django-users/Zfqx-kEE2uY
    # https://code.djangoproject.com/ticket/28951
    created_at = models.DateTimeField(null=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, auto_now=True)

    def __str__(self):
        return f"{self.anho} - {self.mes} - {self.is_open}"

    def save(self, **kwargs) -> None:
        self.full_clean()
        return super().save(**kwargs)
