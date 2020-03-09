from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


# https://stackoverflow.com/questions/849142/
class RangedIntegerField(models.IntegerField):
    def __init__(self, min_value=None, max_value=None, **kwargs):
        self.min_value = min_value
        self.max_value = max_value
        if "validators" in kwargs:
            validators = kwargs["validators"]
        else:
            validators = []
        if min_value:
            validators.append(MinValueValidator(min_value))
        if max_value:
            validators.append(MaxValueValidator(max_value))
        kwargs["validators"] = validators
        super(RangedIntegerField, self).__init__(**kwargs)

    def formfield(self, **kwargs):
        context = {"min_value": self.min_value, "max_value": self.max_value}
        context.update(kwargs)
        return super(RangedIntegerField, self).formfield(**context)


class Sectores(models.IntegerChoices):
    UNO = 1
    DOS = 2
    TRES = 3
    CUATRO = 4
    CINCO = 5
    SEIS = 6
    SIETE = 7


# Django recomienda usar minúsculas para los modelos y crea tablas: api_member
# TODO: No se debería permitir borrar socios de la base de datos. Sólo marcarlos
# como inactivos. Por ejemplo si muere un socio. Su número no debería ser reutilizado
# y deberían poder revisarse sus datos pero no debería ser eliminado. Ahora se está
# haciendo un models.PROTECT en la FK de Invoice para evitarlo. Y se crea el campo
# is_active como idea de futuro


class Member(models.Model):
    # Por defecto django añade un campo `id serial not null primary key`
    # Dudo si num_socio debería ser String. Y también si deberíamos mantener el
    # campo id por defecto
    # Actualmente el número de socio es representado como un entero y no se "formatea"
    # de otro modo (ie: "015"). Tan sólo se hace 0-pad a cuatro caracteres para que
    # las facturas tengan un número uniforme de caracteres.
    # Definirlo como Entero Autoincremental simplifica crear el siguiente número,
    # validar el valor, cambiar el formato.

    # El número de socio es no editable por el usuario, y se calcula automáticamente.
    # El número de socio es "único", no se reutilizan números ya usados. Pero se permite
    # el "traspaso". Es decir dar un "número de socio" / "derecho de consumo" a otro
    # usuario. En lugar de usar el -1 podríamos hacer este método async y calcularlo
    # a través de la API, pero en caso de varios usuarios podría haber problemas de
    # concurrencia y siempre habría que recalcular. Sólo afecta a crear nuevo socio, es
    #  aceptable, no mostrar el nuevo número hasta después de "salvar"

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

    # Entero por el mismo razonamiento que para `num_socio` */
    sector = models.PositiveSmallIntegerField(
        null=False,
        blank=False,
        choices=Sectores.choices,
        verbose_name="Sector",
        help_text="",
    )

    # Tiene sentido fijar un max_length exacto?
    medidor = models.CharField(
        max_length=30,
        null=False,
        blank=False,
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
        null=False, blank=True, default="", verbose_name="Observaciones", help_text=""
    )

    consumo_maximo = models.PositiveSmallIntegerField(
        null=False, blank=False, default=0, verbose_name="Consumo Máximo", help_text=""
    )
    consumo_reduccion_fija = models.PositiveSmallIntegerField(
        null=False,
        blank=False,
        default=0,
        verbose_name="Reducción Fija de Consumo",
        help_text="",
    )

    # null debería ser falso pero para evitar problemas con las fixtures
    # https://groups.google.com/forum/#!topic/django-users/Zfqx-kEE2uY
    # https://code.djangoproject.com/ticket/28951
    created_at = models.DateTimeField(null=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, auto_now=True)

    is_active = models.BooleanField(
        blank=False, null=False, default=True, verbose_name="", help_text=""
    )

    # comunidad. Automático en front a partir de sector

    def __str__(self):
        return f"{self.num_socio} - {self.name}"

    def get_absolute_url(self):
        # TODO
        return f"/socios/{self.num_socio}/"

    class Meta:
        verbose_name = "socio"
        verbose_name_plural = "socios"
        ordering = ("num_socio",)
