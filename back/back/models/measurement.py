from django.db import models


class Measurement(models.Model):
    id_lectura = models.AutoField(
        primary_key=True,
        verbose_name="Id lectura",
        help_text="El Identificador de la lectura no puede estar vacío y no debe repetirse",
    )

    mes_facturacion = models.ForeignKey(
        "InvoicingMonth",
        null=False,
        blank=False,
        related_name="measurements",
        on_delete=models.CASCADE,
    )

    factura = models.ForeignKey(
        "Invoice",
        null=False,
        blank=False,
        related_name="measurements",
        on_delete=models.CASCADE,
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

    cambio_medidor = models.BooleanField(
        blank=False,
        null=False,
        default=False,
        verbose_name="Cambio de medidor",
        help_text="",
    )

    medidor = models.CharField(
        max_length=30, null=True, blank=True, verbose_name="Medidor", help_text=""
    )

    # null debería ser falso pero para evitar problemas con las fixtures
    # https://groups.google.com/forum/#!topic/django-users/Zfqx-kEE2uY
    # https://code.djangoproject.com/ticket/28951
    created_at = models.DateTimeField(null=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, auto_now=True)

    def __str__(self):
        return f"{self.id_lectura} - {self.mes_facturacion} - {self.factura} - {self.caudal_anterior} - {self.caudal_actual} - {self.consumo}"

    def get_absolute_url(self):
        # TODO
        return f"/lectura/{self.id_factura}/"

    class Meta:
        verbose_name = "lectura"
        verbose_name_plural = "lecturas"
        ordering = ("id_lectura",)
