from typing import Any

from django.core import exceptions
from django.db import models, transaction


class MeasurementManager(models.Manager["Measurement"]):
    @transaction.atomic
    def create(self, **kwargs: Any) -> "Measurement":
        measurement = super().create(**kwargs)
        invoice = measurement.invoice
        invoice.update_with_measurement(
            measurement.caudal_actual,
            measurement.caudal_anterior,
            measurement.cambio_medidor,
        )
        invoice.save()

        if measurement.cambio_medidor:
            member = invoice.member
            member.medidor = measurement.medidor
            member.save()

        return measurement


class Measurement(models.Model):
    class Meta:
        verbose_name = "lectura"
        verbose_name_plural = "lecturas"
        ordering = ("id",)

    objects: MeasurementManager = MeasurementManager()

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

    invoice = models.ForeignKey(
        "Invoice", null=False, blank=False, on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.invoice} - {self.caudal_anterior} - {self.caudal_actual}"

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
