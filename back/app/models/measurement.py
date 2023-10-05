from django.core import exceptions
from django.db import models


class Measurement(models.Model):
    class Meta(object):
        verbose_name = "lectura"
        verbose_name_plural = "lecturas"
        ordering = ("id",)

    id = models.AutoField(
        primary_key=True,
        verbose_name="Id lectura",
        help_text="El Identificador de la lectura no puede estar vacío y no debe repetirse",
    )

    caudal_anterior = models.PositiveIntegerField(
        null=False, blank=False, verbose_name="Caudal anterior"
    )

    caudal_actual = models.PositiveIntegerField(
        null=False, blank=False, verbose_name="Caudal actual"
    )

    cambio_medidor = models.BooleanField(
        blank=False, null=False, default=False, verbose_name="Cambio de medidor"
    )

    medidor = models.CharField(
        max_length=30, null=True, blank=True, verbose_name="Medidor"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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

    def __str__(self):
        return f"{self.factura} - {self.caudal_anterior} - {self.caudal_actual}"

    def save(self, **kwargs) -> None:
        self.full_clean()
        super().save(**kwargs)

    @property
    def consumo(self) -> int:
        return self.caudal_actual - self.caudal_anterior

    def clean(self):
        if self.caudal_actual < self.caudal_anterior:
            raise exceptions.ValidationError(
                {
                    exceptions.NON_FIELD_ERRORS: "El caudal actual no puede ser menor al caudal anterior"
                }
            )
