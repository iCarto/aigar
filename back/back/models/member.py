from django.db import models

from back.fields import RangedIntegerField
from domains.models.zone import Zone


class Sectores(models.IntegerChoices):
    UNO = 1, ("TIHUAPA NORTE")
    DOS = 2, ("TIHUAPA NORTE")
    TRES = 3, ("TIHUAPA NORTE")
    CUATRO = 4, ("TIHUAPA NORTE")
    CINCO = 5, ("TLACUXTLI")
    SEIS = 6, ("TLACUXTLI")
    SIETE = 7, ("TLACUXTLI")


class Member(models.Model):
    # Actualmente el número de socio es representado como un entero y no se "formatea"
    # de otro modo (ie: "015"). Tan sólo se hace 0-pad a cuatro caracteres para que
    # las facturas tengan un número uniforme de caracteres.
    # Definirlo como Entero Autoincremental simplifica crear el siguiente número,
    # validar el valor, cambiar el formato. Es un override del `id` por defecto de Django.

    # El número de socio es no editable por el usuario, y se calcula automáticamente.
    # El número de socio es "único", no se reutilizan números ya usados. Pero se permite
    # el "traspaso". Es decir dar un "número de socio" / "derecho de consumo" a otro
    # usuario. En lugar de usar el -1 podríamos hacer este método async y calcularlo
    # a través de la API, pero en caso de varios usuarios podría haber problemas de
    # concurrencia y siempre habría que recalcular. Sólo afecta a crear nuevo socio, es
    # aceptable, no mostrar el nuevo número hasta después de "salvar"

    class Meta(object):
        verbose_name = "socio"
        verbose_name_plural = "socios"
        ordering = ("num_socio",)

    num_socio = models.AutoField(
        primary_key=True,
        verbose_name="Número Socio",
        help_text="El Número de socio no puede estar vacío y no debe repetirse",
    )

    # No deberían darse nombres iguales, pero puede tener sentido permitirlo
    name = models.CharField(
        max_length=100,
        null=False,
        blank=False,
        unique=False,
        verbose_name="Nombre",
        help_text="",
    )

    medidor = models.CharField(
        max_length=30,
        null=True,
        blank=True,
        default="",
        verbose_name="Medidor",
        help_text="",
    )

    # El socio dispone de conexión pero no consume agua
    solo_mecha = models.BooleanField(
        blank=False, null=False, default=False, verbose_name="Sólo Mecha", help_text=""
    )

    # Entero. Orden del recorrido ¿ruta? sería un nombre alternativo válido
    # Si se mete uno nuevo por el medio mover todo el resto de rutas a mano es un lio.
    # Habría que buscar una solución
    # TODO: Review this: https://stackoverflow.com/questions/29067045/
    # Deberíamos poder fijar un orden máximo igual al número de socios activos
    orden = RangedIntegerField(
        null=False,
        blank=False,
        default=0,
        min_value=0,
        max_value=1000,
        verbose_name="Orden del Recorrido",
        help_text="",
    )
    observaciones = models.TextField(
        null=True, blank=True, default="", verbose_name="Observaciones", help_text=""
    )

    consumo_maximo = models.PositiveSmallIntegerField(
        null=True, blank=True, verbose_name="Consumo Máximo", help_text=""
    )
    consumo_reduccion_fija = models.PositiveSmallIntegerField(
        null=True, blank=True, verbose_name="Reducción Fija de Consumo", help_text=""
    )

    # null debería ser falso pero para evitar problemas con las fixtures
    # https://groups.google.com/forum/#!topic/django-users/Zfqx-kEE2uY
    # https://code.djangoproject.com/ticket/28951
    created_at = models.DateTimeField(null=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, auto_now=True)

    is_active = models.BooleanField(
        blank=False, null=False, default=True, verbose_name="", help_text=""
    )

    sector = models.ForeignKey(
        Zone,
        on_delete=models.RESTRICT,
        to_field="name",
        blank=False,
        null=False,
        db_column="zone_name",
        verbose_name="sector / comunidad",
    )

    def __str__(self):
        return f"{self.num_socio} - {self.name}"

    def get_absolute_url(self):
        # TODO
        return f"/socios/{self.num_socio}/"
