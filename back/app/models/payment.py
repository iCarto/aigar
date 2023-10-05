from django.db import models


class Payment(models.Model):
    class Meta(object):
        verbose_name = "pago"
        verbose_name_plural = "pagos"
        ordering = ("id",)

    id = models.AutoField(
        primary_key=True,
        verbose_name="Id pago",
        help_text="El Identificador del pago no puede estar vacío y no debe repetirse",
    )

    fecha = models.DateField(null=False, blank=False, verbose_name="Fecha")

    monto = models.FloatField(null=False, blank=False, verbose_name="Monto")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    factura = models.ForeignKey(
        "Invoice",
        null=False,
        blank=False,
        related_name="payments",
        on_delete=models.CASCADE,
    )

    mes_facturacion = models.ForeignKey(
        "InvoicingMonth",
        null=False,
        blank=False,
        related_name="payments",
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return f"{self.id} - {self.factura} - {self.fecha} - {self.monto}"
