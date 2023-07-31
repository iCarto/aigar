"""Locality (Comunidad).

Nos referimos de este modo a las comunidades, o en sentido amplio al mayor nivel de
agregación territorial que admitimos en la aplicación.

Las comunidades podrán estar divididas en Zones (Sectores). A nivel usuaria sóla los
sectores tienen relevancia. Las comunidades se emplean para que quien configura la app
lo haga de una forma estructurada, así como para simplificar la configuración (por
ejemplo automatizando la creación de los sectores), o para envitar errores (por ejemplo
no teniendo que escribir el nombre varias veces a mano si hay varios sectores)
"""

from django.db import models

from back.fields import StrictCharField


class Locality(models.Model):
    class Meta(object):
        ordering = ["short_name"]
        verbose_name_plural = "comunidades"
        verbose_name = "comunidad"

    name = StrictCharField(
        null=False,
        blank=False,
        verbose_name="nombre",
        help_text="Nombre completo de la comunidad.",
        unique=True,
        apply="capitalize",
        min_length=3,
    )

    short_name = StrictCharField(
        max_length=13,
        null=False,
        blank=False,
        verbose_name="nombre corto",
        help_text="Nombre corto de la comunidad. Se usa en algunas partes de la aplicación (tablas, ...). Máximo 13 caracteres.",
        unique=True,
        apply="capitalize",
        min_length=3,
    )
    number_of_sectors = models.PositiveSmallIntegerField(
        null=False,
        blank=False,
        verbose_name="número de sectores",
        help_text="Introduzca un cero si la comunidad no tiene sectores.",
    )

    def __str__(self):
        return self.short_name
