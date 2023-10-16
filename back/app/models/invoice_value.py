from django.db import models


class InvoiceValue(models.TextChoices):
    # name = value, label
    JORNADA_TRABAJO = "jornada_trabajo", "Jornada de trabajo"  # noqa: WPS115
    ASAMBLEA = "asamblea", "Inasistencia a Asamblea"  # noqa: WPS115

    @classmethod
    def from_value(cls, value: str):
        for c in cls:
            if c.value == value:
                return c
