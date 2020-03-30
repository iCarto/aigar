from django.db import models


class InvoicingMonth(models.Model):
    class Meta:
        unique_together = (("anho", "mes"),)

    id_mes_facturacion = models.TextField(
        primary_key=True,
        null=False,
        blank=False,
        unique=True,
        verbose_name="Identificador",
        help_text="",
    )

    anho = models.TextField(
        null=False, blank=False, unique=False, verbose_name="Año", help_text=""
    )

    mes = models.TextField(null=False, blank=False, verbose_name="Mes", help_text="")

    is_open = models.BooleanField(
        null=False, blank=False, default=False, verbose_name="Mes", help_text=""
    )

    # null debería ser falso pero para evitar problemas con las fixtures
    # https://groups.google.com/forum/#!topic/django-users/Zfqx-kEE2uY
    # https://code.djangoproject.com/ticket/28951
    created_at = models.DateTimeField(null=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, auto_now=True)

    def __str__(self):
        return f"{self.anho} - {self.mes} - {self.opened}"

    def get_absolute_url(self):
        # TODO
        return f"/mes_facturacion/{self.id_factura}/"
