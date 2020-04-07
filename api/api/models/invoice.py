from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from .member import Sectores


fixed_values = {
    "COMISION": 0.28,
    "AHORRO_MANO_DE_OBRA_NORMAL": 0.25,
    "AHORRO_MANO_DE_OBRA_SOLO_MECHA": 0,
    "CUOTA_FIJA_NORMAL": 5.72,
    "CUOTA_FIJA_SOLO_MECHA": 2.72,
    "CUOTA_VARIABLE_MENOS_14": 0,
    "CUOTA_VARIABLE_14_20": 0.75,
    "CUOTA_VARIABLE_MAS_20": 2.5,
}


class InvoiceStatus(models.TextChoices):
    NUEVA = "nueva"
    PENDIENTE_DE_COBRO = "pendiente_de_cobro"
    COBRADA = "cobrada"
    ANULADA = "anulada"


class Invoice(models.Model):

    id_factura = models.AutoField(
        primary_key=True,
        verbose_name="Id factura",
        help_text="El Identificador de la factura no puede estar vacío y no debe repetirse",
    )
    # No deberían darse nombres iguales, pero puede tener sentido permitirlo
    mes_facturacion = models.ForeignKey(
        "InvoicingMonth",
        null=False,
        blank=False,
        related_name="invoices",
        related_query_name="invoice",
        on_delete=models.CASCADE,
    )

    member = models.ForeignKey(
        "Member",
        null=False,
        blank=False,
        related_query_name="invoice",
        on_delete=models.CASCADE,
    )

    nombre = models.CharField(
        max_length=100,
        null=False,
        blank=False,
        unique=False,
        verbose_name="Nombre socio",
        help_text="",
    )

    sector = models.PositiveSmallIntegerField(
        null=False,
        blank=False,
        choices=Sectores.choices,
        verbose_name="Sector",
        help_text="",
    )

    anho = models.PositiveSmallIntegerField(
        null=False, blank=False, unique=False, verbose_name="Año", help_text=""
    )

    mes_facturado = models.PositiveSmallIntegerField(
        null=False, blank=False, verbose_name="Mes facturado", help_text=""
    )

    mes_limite = models.PositiveSmallIntegerField(
        null=False, blank=False, verbose_name="Mes límite", help_text=""
    )

    caudal_anterior = models.PositiveIntegerField(
        null=True, blank=True, verbose_name="Caudal anterior", help_text=""
    )

    caudal_actual = models.PositiveIntegerField(
        null=True, blank=True, verbose_name="Caudal actual", help_text=""
    )

    consumo = models.IntegerField(
        null=True, blank=True, verbose_name="Consumo", help_text=""
    )

    cuota_fija = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Cuota fija", help_text=""
    )

    cuota_variable = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Cuota variable", help_text=""
    )

    comision = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Comisión", help_text=""
    )

    ahorro = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Ahorro", help_text=""
    )

    mora = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Mora", help_text=""
    )

    derecho = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Derecho", help_text=""
    )

    reconexion = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Reconexión", help_text=""
    )

    asamblea = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Asamblea", help_text=""
    )

    traspaso = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Traspaso", help_text=""
    )

    saldo_pendiente = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Saldo pendiente", help_text=""
    )

    saldo_anterior = models.FloatField(
        null=False, blank=False, default=0, verbose_name="Saldo anterior", help_text=""
    )

    total = models.FloatField(null=True, blank=True, verbose_name="Total", help_text="")

    estado = models.TextField(
        null=False,
        blank=False,
        choices=InvoiceStatus.choices,
        verbose_name="Estado",
        help_text="",
        default=InvoiceStatus.NUEVA,
    )

    observaciones = models.TextField(
        null=True, blank=True, default="", verbose_name="Observaciones", help_text=""
    )

    entrega = models.BooleanField(
        blank=False, null=False, default=False, verbose_name="Entrega", help_text=""
    )

    pago_1_al_11 = models.FloatField(
        null=True, blank=True, default=0, verbose_name="Pago 1 al 11", help_text=""
    )

    pago_11_al_30 = models.FloatField(
        null=True, blank=True, default=0, verbose_name="Pago 11 al 30", help_text=""
    )

    # null debería ser falso pero para evitar problemas con las fixtures
    # https://groups.google.com/forum/#!topic/django-users/Zfqx-kEE2uY
    # https://code.djangoproject.com/ticket/28951
    created_at = models.DateTimeField(null=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, auto_now=True)

    def __str__(self):
        return f"{self.id_factura} - {self.member} - {self.nombre} - {self.mes_facturado} - {self.anho} - {self.total}"

    def get_absolute_url(self):
        # TODO
        return f"/factura/{self.id_factura}/"

    class Meta:
        verbose_name = "factura"
        verbose_name_plural = "facturas"
        ordering = ("id_factura",)

    def update_with_measurement(self, caudal_anterior, caudal_actual):
        self.comision = fixed_values["COMISION"]
        self.ahorro = (
            fixed_values["AHORRO_MANO_DE_OBRA_SOLO_MECHA"]
            if self.member.solo_mecha
            else fixed_values["AHORRO_MANO_DE_OBRA_NORMAL"]
        )
        self.cuota_fija = (
            fixed_values["CUOTA_FIJA_SOLO_MECHA"]
            if self.member.solo_mecha
            else fixed_values["CUOTA_FIJA_NORMAL"]
        )
        self.caudal_actual = caudal_actual
        self.caudal_anterior = caudal_anterior
        self.consumo = self.caudal_actual - self.caudal_anterior
        consumo_final = (
            min(self.consumo, self.member.consumo_maximo)
            if self.member.consumo_maximo != 0
            else self.consumo
        ) - self.member.consumo_reduccion_fija
        if 0 < consumo_final <= 14:
            self.cuota_variable = (
                fixed_values["CUOTA_VARIABLE_MENOS_14"] * consumo_final
            )
        elif 14 < consumo_final <= 20:
            self.cuota_variable = fixed_values["CUOTA_VARIABLE_14_20"] * consumo_final
        else:
            self.cuota_variable = fixed_values["CUOTA_VARIABLE_MAS_20"] * consumo_final

        self.total = (
            self.cuota_fija
            + self.cuota_variable
            + self.comision
            + self.ahorro
            + self.mora
            + self.asamblea
            + self.derecho
            + self.reconexion
            + self.traspaso
            + self.saldo_anterior
        )
        return self

    def update_with_payment(self, fecha_pago, monto_pago):
        if fecha_pago.day < 11:
            self.pago_1_al_11 = self.pago_1_al_11 + monto_pago
        else:
            self.pago_11_al_30 = self.pago_11_al_30 + monto_pago
