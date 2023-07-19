from django.db import models


class Payment(models.Model):
    class Meta:
        verbose_name = "pago"
        verbose_name_plural = "pagos"
        ordering = ("id_pago",)

    id_pago = models.AutoField(
        primary_key=True,
        verbose_name="Id pago",
        help_text="El Identificador del pago no puede estar vacío y no debe repetirse",
    )

    fecha = models.DateField(
        null=False, blank=False, verbose_name="Fecha", help_text=""
    )

    monto = models.FloatField(
        null=False, blank=False, verbose_name="Monto", help_text=""
    )

    # null debería ser falso pero para evitar problemas con las fixtures
    # https://groups.google.com/forum/#!topic/django-users/Zfqx-kEE2uY
    # https://code.djangoproject.com/ticket/28951
    created_at = models.DateTimeField(null=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, auto_now=True)

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
        return f"{self.id_pago} - {self.mes_facturacion} - {self.factura} - {self.fecha} - {self.monto}"

    def get_absolute_url(self):
        # TODO
        return f"/pago/{self.id_factura}/"
