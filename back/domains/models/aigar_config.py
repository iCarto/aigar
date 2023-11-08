"""AigarConfig. Configuración de AIGAR.

# Configuración básica

* Nombre de la JA
* Hay csv bancario

No permitimos configurar la "carpeta de la base de datos". Esta carpeta será donde se
almacene la base de datos y otra información como los logos o la plantilla de recibos.
La configuramos como el MEDIA_ROOT para que se pueda servir la información fácilmente.

En principio la ubicaremos en el directorio estándar para estas tareas en Windows

%APPDATA%/aigar_data

Al preparar la aplicación desde ASAPS la idea sería (por ahora) que crearan la carpeta
a mano, metieran un db.sqlite3 vacío, un logo.png y la plantilla. Abren la aplicación,
la configuran, la zipean. Y a la JA le pasan esa carpeta y se la ponen luego en su
ordenador y le pasan también el zip de la aplicación.

Logos. Tendremos uno génerico totalmente transparente del tamaño adecuado.

# Conceptos del recibo y otros parámetros

Además de la tarifa por consumo de agua, el recibo tiene una serie de conceptos como
"Inasistencia a Asambleas" y requiere de parámetros cómo las cuotas del derecho de
conexión.

Los conceptos en sí, al menos por ahora son fijos. La usuaria no puede modificar el
concepto, sólo el valor asociado al mismo.

En este modelo se definen (almacenan) esos conceptos y los valores que le asocia la
usuaria.

https://forum.djangoproject.com/t/business-logic-constants-the-best-place-to-define-them/8136/3
"""


from decimal import Decimal
from typing import NewType, cast

from django.core import exceptions, validators
from django.db import models
from solo.models import SingletonModel

from app.models.invoice_value import InvoiceValue
from back.fields import RangedIntegerField, StrictCharField


Stretches = NewType("Stretches", list[dict[str, int | Decimal]])

# Valor de consumo que nunca será alcanzado para las comparaciones de tramos
# en la cuota variable
MAX_LIMIT_VALUE = 10000


class AigarConfig(SingletonModel):
    class Meta(object):
        verbose_name_plural = "Configuración de AIGAR"
        verbose_name = "Configuración de AIGAR"
        ordering = ("id",)
        constraints = [
            models.CheckConstraint(
                # Estaría bien que RangedIntegerField añadiera la constraint por si sóla
                # https://adamj.eu/tech/2021/05/08/django-check-constraints-limit-range-integerfield/
                # https://stackoverflow.com/questions/33772947/django-set-range-for-integer-model-field-as-constraint
                # check=models.Q(payment_due_day__gte=1) & models.Q(payment_due_day__lte=28),
                check=models.Q(payment_due_day__range=(1, 28)),
                name="%(app_label)s_%(class)s_payment_due_day_range",  # noqa: WPS323
                violation_error_message="El día límite de pago debe estar entre 1 y 28",
            )
        ]

    name = StrictCharField(
        null=False,
        blank=False,
        verbose_name="Nombre de la Junta de Agua",
        help_text="Nombre de la Junta de Agua como desea que aparezca en los recibos",
        default="Junta de Agua",
        min_length=3,
    )

    payment_method = models.TextField(
        null=False,
        blank=False,
        verbose_name="Forma de pago",
        help_text="Tal cual quiere que aparezca en el recibo",
        default="BANCO .... Cuenta No: .... ",
    )

    payment_csv = models.BooleanField(
        null=False,
        blank=False,
        default=False,
        verbose_name="Importar pagos en CSV",
        help_text="Marque esta casilla si los pagos se importarán mediante un CSV generado por el banco",
    )

    payment_due_day = RangedIntegerField(
        null=False,
        blank=False,
        min_value=1,
        max_value=27,
        default=15,
        verbose_name="Día límite de pago",
        help_text="Día del mes hasta el que (incluido) el pago no tendrá mora.",
    )

    comision = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=False,
        blank=False,
        default=Decimal("0.28"),
        verbose_name="Comisión de pago banco",
        help_text="Comisión de pago banco (dentro de la cuota)",
        validators=[validators.MinValueValidator(0)],
    )
    recargo_mora = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=False,
        blank=False,
        default=Decimal("1"),
        verbose_name="Recargo por mora",
        help_text="Recargo por mora",
        validators=[validators.MinValueValidator(0)],
    )

    asamblea = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=False,
        blank=False,
        default=Decimal("2"),
        verbose_name="Inasistencia a asambleas",
        help_text="Inasistencia a asambleas",
        validators=[validators.MinValueValidator(0)],
    )
    jornada_trabajo = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=False,
        blank=False,
        default=Decimal("2"),
        verbose_name="Jornada de trabajo",
        help_text="Incremento de coste por no haber participado en la Jornada de Trabajo",
        validators=[validators.MinValueValidator(0)],
    )
    reconexion = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=False,
        blank=False,
        default=Decimal("10"),
        verbose_name="Re-conexión",
        help_text="Re-conexión",
        validators=[validators.MinValueValidator(0)],
    )
    ahorro = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=False,
        blank=False,
        default=Decimal("0.25"),
        verbose_name="Ahorro mano de obra",
        help_text="Ahorro mano de obra (dentro de la cuota)",
        validators=[validators.MinValueValidator(0)],
    )
    traspaso_derecho = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=False,
        blank=False,
        default=Decimal("0"),
        verbose_name="Traspaso de derecho",
        help_text="Traspaso de derecho (cambio de nombre)",
        validators=[validators.MinValueValidator(0)],
    )
    humano_cuota_fija = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=False,
        blank=False,
        default=Decimal("5.72"),
        verbose_name="Cuota fija - Consumo Humano",
        help_text="Cuota fija - Consumo Humano (valor en $)",
        validators=[validators.MinValueValidator(0)],
    )
    comercial_cuota_fija = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=False,
        blank=False,
        default=Decimal("5.72"),
        verbose_name="Cuota fija - Consumo Comercial",
        help_text="Cuota fija - Consumo Comercial - (valor en $)",
        validators=[validators.MinValueValidator(0)],
    )
    humano_nuevo_derecho_total = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=False,
        blank=False,
        default=Decimal("300"),
        verbose_name="Nuevo derecho - Humano (valor total en $)",
        help_text="Nuevo derecho - Humano (valor total en $)",
        validators=[validators.MinValueValidator(0)],
    )
    humano_nuevo_derecho_primera_cuota = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=False,
        blank=False,
        default=Decimal("100"),
        verbose_name="Nuevo derecho - Humano (pago mínimo en $ / primera cuota)",
        help_text="Nuevo derecho - Humano (pago mínimo en $ / primera cuota)",
        validators=[validators.MinValueValidator(0)],
    )

    comercial_nuevo_derecho_total = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=False,
        blank=False,
        default=Decimal("400"),
        verbose_name="Nuevo derecho - Humano (valor total en $)",
        help_text="Nuevo derecho - Humano (valor total en $)",
        validators=[validators.MinValueValidator(0)],
    )
    comercial_nuevo_derecho_primera_cuota = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=False,
        blank=False,
        default=Decimal("150"),
        verbose_name="Nuevo derecho - Humano (pago mínimo en $ / primera cuota)",
        help_text="Nuevo derecho - Humano (pago mínimo en $ / primera cuota)",
        validators=[validators.MinValueValidator(0)],
    )

    nuevo_derecho_siguientes_cuotas_opcion1 = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Opción 1 de cuotas para nuevo derecho de conexión",
        help_text="Valor a seleccionar en la interfaz como siguientes cuotas del nuevo derecho en $, descontando la primera",
        validators=[validators.MinValueValidator(0)],
    )
    nuevo_derecho_siguientes_cuotas_opcion2 = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Opción 2 de cuotas para nuevo derecho de conexión",
        help_text="Valor a seleccionar en la interfaz como siguientes cuotas del nuevo derecho en $, descontando la primera",
        validators=[validators.MinValueValidator(0)],
    )
    nuevo_derecho_siguientes_cuotas_opcion3 = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Opción 3 de cuotas para nuevo derecho de conexión",
        help_text="Valor a seleccionar en la interfaz como siguientes cuotas del nuevo derecho en $, descontando la primera",
        validators=[validators.MinValueValidator(0)],
    )
    nuevo_derecho_siguientes_cuotas_opcion4 = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Opción 4 de cuotas para nuevo derecho de conexión",
        help_text="Valor a seleccionar en la interfaz como siguientes cuotas del nuevo derecho en $, descontando la primera",
        validators=[validators.MinValueValidator(0)],
    )
    nuevo_derecho_siguientes_cuotas_opcion5 = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Opción 5 de cuotas para nuevo derecho de conexión",
        help_text="Valor a seleccionar en la interfaz como siguientes cuotas del nuevo derecho en $, descontando la primera",
        validators=[validators.MinValueValidator(0)],
    )
    nuevo_derecho_siguientes_cuotas_opcion6 = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Opción 6 de cuotas para nuevo derecho de conexión",
        help_text="Valor a seleccionar en la interfaz como siguientes cuotas del nuevo derecho en $, descontando la primera",
        validators=[validators.MinValueValidator(0)],
    )

    humano_cuota_variable_primer_tramo_cantidad = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        default=Decimal("14"),
        verbose_name="Humano - Cuota Variable - Primer tramo (m3)",
        help_text="Primer tramo de consumo. De 0 a este valor incluído. Déjelo en blanco si todo el consumo tiene el mismo coste",
        validators=[validators.MinValueValidator(0)],
    )
    humano_cuota_variable_primer_tramo_coste = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=False,
        blank=False,
        default=Decimal("0"),
        verbose_name="Humano - Cuota Variable - Primer tramo ($)",
        help_text="Coste del consumo que esté dentro de este tramo",
        validators=[validators.MinValueValidator(0)],
    )
    humano_cuota_variable_segundo_tramo_cantidad = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        default=Decimal("20"),
        verbose_name="Humano - Cuota Variable - Segundo tramo (m3)",
        help_text="El segundo tramo va desde el final del tramo anterior hasta este valor (incluído). Déjelo en blanco si cualquier valor mayor al tramo anterior tiene el mismo coste",
        validators=[validators.MinValueValidator(0)],
    )
    humano_cuota_variable_segundo_tramo_coste = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=False,
        blank=False,
        default=Decimal("0.75"),
        verbose_name="Humano - Cuota Variable - Segundo tramo ($)",
        help_text="Coste del consumo que esté dentro de este tramo. Déjelo a 0 si este tramo no aplica.",
        validators=[validators.MinValueValidator(0)],
    )
    humano_cuota_variable_tercer_tramo_cantidad = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Humano - Cuota Variable - Tercer tramo (m3)",
        help_text="El tercer tramo va desde el final del tramo anterior hasta este valor (incluído). Déjelo en blanco si cualquier valor mayor al tramo anterior tiene el mismo coste",
        validators=[validators.MinValueValidator(0)],
    )
    humano_cuota_variable_tercer_tramo_coste = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=False,
        blank=False,
        default=Decimal("2"),
        verbose_name="Cuota Variable - Humano - Tercer tramo ($)",
        help_text="Coste del consumo que esté dentro de este tramo. Déjelo a 0 si este tramo no aplica.",
        validators=[validators.MinValueValidator(0)],
    )
    humano_cuota_variable_cuarto_tramo_cantidad = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Cuota Variable - Humano - Cuarto tramo (m3)",
        help_text="El cuarto tramo va desde el final del tramo anterior hasta este valor (incluído). Déjelo en blanco si cualquier valor mayor al tramo anterior tiene el mismo coste",
        validators=[validators.MinValueValidator(0)],
    )
    humano_cuota_variable_cuarto_tramo_coste = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=False,
        blank=False,
        default=Decimal("0"),
        verbose_name="Humano - Cuota Variable - Cuarto tramo ($)",
        help_text="Coste del consumo que esté dentro de este tramo. Déjelo a 0 si este tramo no aplica.",
        validators=[validators.MinValueValidator(0)],
    )

    comercial_cuota_variable_primer_tramo_cantidad = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Comercial -Cuota Variable - Primer tramo (m3)",
        help_text="Primer tramo de consumo. De 0 a este valor incluído. Déjelo en blanco si todo el consumo tiene el mismo coste",
        validators=[validators.MinValueValidator(0)],
    )
    comercial_cuota_variable_primer_tramo_coste = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=False,
        blank=False,
        default=Decimal("0"),
        verbose_name="Comercial - Cuota Variable - Primer tramo ($)",
        help_text="Cuota Variable - Comercial - Primer tramo ($)",
        validators=[validators.MinValueValidator(0)],
    )
    comercial_cuota_variable_segundo_tramo_cantidad = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Comercial - Cuota Variable - Segundo tramo (m3)",
        help_text="El segundo tramo va desde el final del tramo anterior hasta este valor (incluído). Déjelo en blanco si cualquier valor mayor al tramo anterior tiene el mismo coste",
        validators=[validators.MinValueValidator(0)],
    )
    comercial_cuota_variable_segundo_tramo_coste = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=False,
        blank=False,
        default=Decimal("0"),
        verbose_name="Comercial - Cuota Variable - Segundo tramo ($)",
        help_text="Coste del consumo que esté dentro de este tramo. Déjelo a 0 si este tramo no aplica.",
        validators=[validators.MinValueValidator(0)],
    )
    comercial_cuota_variable_tercer_tramo_cantidad = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Comercial - Cuota Variable - Tercer tramo (m3)",
        help_text="El tercer tramo va desde el final del tramo anterior hasta este valor (incluído). Déjelo en blanco si cualquier valor mayor al tramo anterior tiene el mismo coste",
        validators=[validators.MinValueValidator(0)],
    )
    comercial_cuota_variable_tercer_tramo_coste = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=False,
        blank=False,
        default=Decimal("0"),
        verbose_name="Comercial Cuota Variable - Tercer tramo ($)",
        help_text="Coste del consumo que esté dentro de este tramo. Déjelo a 0 si este tramo no aplica.",
        validators=[validators.MinValueValidator(0)],
    )
    comercial_cuota_variable_cuarto_tramo_cantidad = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Comercial - Cuota Variable - Cuarto tramo (m3)",
        help_text="El cuarto tramo va desde el final del tramo anterior hasta este valor (incluído). Déjelo en blanco si cualquier valor mayor al tramo anterior tiene el mismo coste",
        validators=[validators.MinValueValidator(0)],
    )
    comercial_cuota_variable_cuarto_tramo_coste = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=False,
        blank=False,
        default=Decimal("0"),
        verbose_name="Comercial - Cuota Variable - Cuarto tramo ($)",
        help_text="Coste del consumo que esté dentro de este tramo. Déjelo a 0 si este tramo no aplica.",
        validators=[validators.MinValueValidator(0)],
    )

    def __str__(self):
        return "Configuración de AIGAR"

    @property
    def nuevo_derecho_siguientes_cuotas_opciones(self) -> list[Decimal]:
        options = [
            self.nuevo_derecho_siguientes_cuotas_opcion1,
            self.nuevo_derecho_siguientes_cuotas_opcion2,
            self.nuevo_derecho_siguientes_cuotas_opcion3,
            self.nuevo_derecho_siguientes_cuotas_opcion4,
            self.nuevo_derecho_siguientes_cuotas_opcion5,
            self.nuevo_derecho_siguientes_cuotas_opcion6,
        ]
        options = [o for o in options if o]
        options.sort()

        return options

    def clean(self) -> None:
        self._validate_stretches(self._prepare_stretches("comercial"))
        self._validate_stretches(self._prepare_stretches("humano"))

    def get_stretches(self, member) -> Stretches:
        tipo_uso = getattr(member, "tipo_uso", "").lower()
        results = self._prepare_stretches(tipo_uso)
        results = [result for result in results if result["limit"]]
        return cast(Stretches, results)

    def _prepare_stretches(self, tipo_uso: str) -> Stretches:
        results = []
        for stretch in ("primer", "segundo", "tercer", "cuarto"):
            limit = getattr(self, f"{tipo_uso}_cuota_variable_{stretch}_tramo_cantidad")
            cost = getattr(self, f"{tipo_uso}_cuota_variable_{stretch}_tramo_coste")
            results.append({"cost": cost, "limit": limit})

        for r in results:
            if r["limit"] is None and r["cost"] > 0:
                r["limit"] = MAX_LIMIT_VALUE
        return cast(Stretches, results)

    def _validate_stretches(self, stretches: Stretches) -> None:
        try:
            min_index_of_none = min(
                i
                for i, result in enumerate(stretches)
                if result["limit"] in {None, MAX_LIMIT_VALUE}
            )
        except ValueError:
            raise exceptions.ValidationError(
                {
                    exceptions.NON_FIELD_ERRORS: f"Debe dejar al menos un tramo con la cantidad en blanco: {stretches}"
                }
            )
        foo = [
            result
            for result in (stretches[min_index_of_none:])
            if result["limit"] not in {None, MAX_LIMIT_VALUE}
        ]
        if foo:
            raise exceptions.ValidationError(
                {
                    exceptions.NON_FIELD_ERRORS: f"No puede haber mezclados valores en blanco en la cuota variable: {stretches}"
                }
            )

        more_than_one_with_no_limit_and_cost = [
            r
            for r in stretches
            if r["limit"] in {None, MAX_LIMIT_VALUE} and r["cost"] > 0
        ]
        if len(more_than_one_with_no_limit_and_cost) > 1:
            raise exceptions.ValidationError(
                {
                    exceptions.NON_FIELD_ERRORS: f"No puede haber más de un tramo de cuota variable con el límite en blanco y el coste mayor a 0: {more_than_one_with_no_limit_and_cost}"
                }
            )

        results_sorted = sorted(
            stretches, key=lambda x: (x["limit"] is None, x["limit"])
        )
        if stretches != results_sorted:
            raise exceptions.ValidationError(
                {
                    exceptions.NON_FIELD_ERRORS: f"Los rangos de la cuota variable no están bien definidos: {stretches}"
                }
            )


CONFIG = None


def get_config() -> AigarConfig:
    global CONFIG
    if not CONFIG:
        CONFIG = AigarConfig.get_solo()
    return CONFIG


def get_config_nuevo_derecho(member):
    config = get_config()
    tipo_uso = member.tipo_uso.lower()
    return {
        "total": getattr(config, f"{tipo_uso}_nuevo_derecho_total"),
        "primera_cuota": getattr(config, f"{tipo_uso}_nuevo_derecho_primera_cuota"),
        "numero_cuotas": 4 if tipo_uso == "humano" else 2,
    }


def get_invoice_value(invoice_value: InvoiceValue, member=None) -> Decimal | int:
    # https://stackoverflow.com/questions/60616802/how-to-type-hint-a-generic-numeric-type-in-python
    config = get_config()
    tipo_uso = getattr(member, "tipo_uso", "").lower()
    if tipo_uso:
        return getattr(config, f"{tipo_uso}_{invoice_value.value}")
    return getattr(config, invoice_value.value)
