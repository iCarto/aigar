from typing import Any

from django.db import models, transaction

from app.models.invoicing_month import InvoicingMonth


class PaymentManager(models.Manager["Payment"]):
    @transaction.atomic
    def create(self, **kwargs: Any) -> "Payment":
        payment = super().create(**kwargs)
        invoice = payment.invoice
        # reload data because another payment could have updated the invoice
        invoice.refresh_from_db()
        invoice.update_with_payment(payment.fecha, payment.monto)
        invoice.save()
        return payment

    def filter_by_invoicingmonth(
        self, invoicingmonth: str | InvoicingMonth
    ) -> models.QuerySet["Payment"]:
        return self.get_queryset().filter(invoice__mes_facturacion=invoicingmonth)


class Payment(models.Model):
    class Meta(object):
        verbose_name = "pago"
        verbose_name_plural = "pagos"
        ordering = ("id",)

    objects: PaymentManager = PaymentManager()

    id = models.AutoField(
        primary_key=True,
        verbose_name="Id pago",
        help_text="El Identificador del pago no puede estar vacío y no debe repetirse",
    )

    fecha = models.DateField(null=False, blank=False, verbose_name="Fecha")

    monto = models.FloatField(null=False, blank=False, verbose_name="Monto")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    invoice = models.ForeignKey(
        "Invoice", null=False, blank=False, on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.id} - {self.invoice} - {self.monto}"
