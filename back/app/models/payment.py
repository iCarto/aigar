from typing import Any, Dict, List

from django.db import models, transaction
from django.shortcuts import get_object_or_404

from app.models.invoice import Invoice
from app.models.invoicing_month import InvoicingMonth


def get_invoices_for_payments(payments):
    num_socios = [payment["id_factura"] for payment in payments]
    return Invoice.objects.filter(id_factura__in=num_socios)


def get_invoice_by_id_factura(invoices, id_):
    invoice = [invoice for invoice in invoices if id_ == invoice.id]
    if invoice:
        return invoice[0]
    return None


class PaymentManager(models.Manager["Payment"]):
    def create_many(self, payments: List[Dict[str, Any]]):
        invoicing_month = get_object_or_404(InvoicingMonth, is_open=True)
        # TODO. Check if valid invoicing_month

        invoices = get_invoices_for_payments(payments)
        for payment in payments:
            invoice = get_invoice_by_id_factura(invoices, payment["id_factura"])
            payment["factura"] = payment["id_factura"]
            payment["mes_facturacion"] = invoicing_month.id_mes_facturacion

    @transaction.atomic
    def create(self, **kwargs: Any) -> "Payment":
        payment = super().create(**kwargs)
        invoice = payment.factura
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
        return f"{self.id} - {self.invoice_id} - {self.fecha} - {self.monto}"
