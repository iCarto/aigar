"""Zone. "Sector" o "Sector/Comunidad".

Cada una de los espacios territoriales en las que se dividirá el ámbito de una Junta de
Agua o de su Sistema. Especialmente a la hora de realizar los recorridos para la toma de
datos de medidores.

Nos referimos por tanto a un sector dentro de una comunidad, o a una comunidad completa
cuando no esté divida en sectores.

Para el usuario siempre hablaremos de "Sector/Comunidad" y con este modelo cubrimos los
casos de uso:

* Una sóla comunidad sin sectores. Para este caso el modelo no funciona bien porqué no
  serían necesarios filtros. "Comunidad 1".
* Una sóla comunidad con varios sectores. "1", "2".
* Varias comunidades sin sectores. "Comunidad 1", "Comunidad 2".
* Varias comunidades con sectores. "1 - Comunidad 1", "2 - Comunidad 1", "3 - Comunidad 2"
  * El estándar consensuado es que la numeración de los sectores secuencial, sin gaps, y
    sin reiniciar por comunidad.
  * Los sectores son creados en el orden del "short_name" de las comunidades

Al ser una app de escritorio es importante definir un estructura de bd flexible, aunque
ahora no la usemos. Pensemos en "ciudades y barrios" o "barrios y calles". Haremos el
modelo no modificable por ahora, pero debemos dejar una estructura preparada para unir
sectores, borrarlos, crear nuevos, ...

Una de las ideas clave es no tener que hacer JOIN de múltiples tablas para obtener el
valor de sector a representar en un Member.
"""
from __future__ import annotations

from typing import TYPE_CHECKING

from django.db import models

from back.fields import RangedIntegerField, StrictCharField


class Zone(models.Model):
    class Meta(object):
        ordering = ("name",)
        verbose_name_plural = "Sectores / Comunidades"
        verbose_name = "Sector / Comunidad"

    if TYPE_CHECKING:
        # https://stackoverflow.com/questions/75361847
        locality_id: str

    name = StrictCharField(
        null=False,
        blank=False,
        verbose_name="nombre",
        help_text="Nombre del sector o comunidad. No debe repetirse.",
        unique=True,
        editable=False,
    )

    code = StrictCharField(
        null=True,
        blank=True,
        verbose_name="número de sector",
        help_text="Si la comunidad tiene sectores introduzca el número de este sector. Deben ser correlativos.",
        min_length=1,
        editable=False,
    )

    reading_day = RangedIntegerField(
        min_value=1,
        max_value=31,
        default=27,
        verbose_name="Día de lectura",
        help_text="Día de lectura de los medidores",
    )

    locality = models.ForeignKey(
        "Locality",
        on_delete=models.CASCADE,
        db_index=False,
        to_field="short_name",
        blank=False,
        null=False,
        db_column="locality_short_name",
        verbose_name="comunidad",
        editable=False,
    )

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.name = build_name(self.code, self.locality_short_name)
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def locality_short_name(self) -> str:
        return self.locality_id

    @property
    def long_name(self) -> str:
        locality_long_name = self.locality.name
        if self.code:
            return f"{locality_long_name} sector {self.code}"
        return locality_long_name


def build_name(code, locality_short_name):
    if code:
        return f"{code} - {locality_short_name}"
    return locality_short_name
