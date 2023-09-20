"""Locality (Comunidad).

Nos referimos de este modo a las comunidades, o en sentido amplio al mayor nivel de
agregación territorial que admitimos en la aplicación.

Las comunidades podrán estar divididas en Zones (Sectores). A nivel usuaria sóla los
sectores tienen relevancia. Las comunidades se emplean para que quien configura la app
lo haga de una forma estructurada, así como para simplificar la configuración (por
ejemplo automatizando la creación de los sectores), o para envitar errores (por ejemplo
no teniendo que escribir el nombre varias veces a mano si hay varios sectores)
"""

import functools
import itertools
from typing import Any

from django.db import models, transaction
from django.forms import ValidationError

from back.fields import StrictCharField
from domains.models.zone import Zone


class LocalityManager(models.Manager):
    @transaction.atomic
    def create(self, **kwargs: Any) -> Any:
        with_zones = kwargs.pop("with_zones", True)
        instance = super().create(**kwargs)
        if with_zones:
            self.create_with_zones(instance)
        return instance

    @transaction.atomic
    def create_with_zones(self, instance=None) -> None:
        # Si estoy usando sectores, la nueva localidad puede hacer que cambie el orden,
        # así que los recreo todos.
        # Si instance es None es que estoy borrando y también tengo que recrear todos.
        # En ambos casos implica perder el dato de measuring_day.
        if not instance or instance.number_of_sectors:
            all_localities = list(Locality.objects.all())
            Zone.objects.all().delete()
            for index, zone in enumerate(_all_zones(all_localities)):
                Zone.objects.create(locality=zone, code=str(index + 1))
            return

        # Si no estoy usando varios sectores simplemente creo uno para la nueva localidad
        Zone.objects.create(locality=instance, code=None)


class Locality(models.Model):
    class Meta(object):
        ordering = ["short_name"]
        verbose_name_plural = "comunidades"
        verbose_name = "comunidad"

    objects = LocalityManager()

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

    def clean(self) -> None:
        all_localities = list(Locality.objects.exclude(id=self.id)) + [self]

        with_sectors = sum((loc.number_of_sectors or 0) > 0 for loc in all_localities)
        without_sectors = sum(loc.number_of_sectors == 0 for loc in all_localities)

        if with_sectors and without_sectors:
            raise ValidationError(
                {
                    "number_of_sectors": "No puede haber comunidades con 0 sectores y otras con más de 0 a la vez"
                }
            )
        return super().clean()


def _all_zones(all_localities: list[Locality]) -> list[Locality]:
    return functools.reduce(
        lambda acc, l: list(
            itertools.chain(acc, [l] * l.number_of_sectors)  # noqa: WPS435
        ),
        all_localities,
        [],
    )
