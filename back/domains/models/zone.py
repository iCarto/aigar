"""Zone. "Sector" o "Sector/Comunidad".

Cada una de los espacios territoriales en las que se dividirá el ámbito de una Junta de
Agua o de su Sistema. Especialmente a la hora de realizar los recorridos para la toma de
datos de contadores.

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

from back.fields import StrictCharField
from domains.models.locality import Locality


class Zone(models.Model):
    class Meta(object):
        ordering = ["name"]
        verbose_name_plural = "Sectores / Comunidades"
        verbose_name = "Sector / Comunidad"

    if TYPE_CHECKING:  # noqa: CCE001 CCE002 WPS604
        # https://stackoverflow.com/questions/75361847
        locality_id: str

    name = StrictCharField(
        null=False,
        blank=False,
        verbose_name="nombre",
        help_text="Nombre del sector o comunidad. No debe repetirse.",
        unique=True,
    )

    code = StrictCharField(
        null=True,
        blank=True,
        verbose_name="número de sector",
        help_text="Si la comunidad tiene sectores introduzca el número de este sector. Deben ser correlativos.",
        min_length=1,
    )

    # TODO: valorar db_index
    locality = models.ForeignKey(
        Locality,
        on_delete=models.CASCADE,
        db_index=False,
        to_field="short_name",
        blank=False,
        null=False,
        db_column="locality_short_name",
        verbose_name="comunidad",
    )

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.name = build_name(self.code, self.locality_short_name)
        super().save(*args, **kwargs)

    @property
    def locality_short_name(self) -> str:
        return self.locality_id

    # def delete(self, *args, **kwargs):
    #      # solo si no quedan derivados
    #      if self.name == "Yoko Ono's blog":
    #         return  # Does not allow to delete
    #     else:
    #         super().delete(*args, **kwargs)  # Call the "real" save() method.


def build_name(code, locality_short_name):
    if code:
        return f"{code} - {locality_short_name}"
    return locality_short_name
