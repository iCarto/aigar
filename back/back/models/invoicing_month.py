from typing import Any

from django.db import models


class InvoicingMonthManager(models.Manager):
    def create(self, **kwargs: Any) -> Any:
        kwargs["id_mes_facturacion"] = kwargs["anho"] + kwargs["mes"]

        # Just ensure that invoices are not set in the payload. It should be checked at
        # frontend and remove this sanity check.
        kwargs.pop("invoices", None)
        return super().create(**kwargs)


class InvoicingMonth(models.Model):
    class Meta(object):
        unique_together = (("anho", "mes"),)
        constraints = [
            models.UniqueConstraint(
                name="%(app_label)s_%(class)s_only_one_invoicing_month_open",  # noqa: WPS323
                violation_error_message="Existen varios meses de facturación abiertos. Debe revisar este problema.",
                fields=["is_open"],
                condition=models.Q(is_open=True),
            )
        ]

    objects = InvoicingMonthManager()

    id_mes_facturacion = models.TextField(
        primary_key=True,
        null=False,
        blank=False,
        unique=True,
        verbose_name="Identificador",
        help_text="",
        editable=False,
    )

    anho = models.TextField(
        null=False, blank=False, unique=False, verbose_name="Año", help_text=""
    )

    mes = models.TextField(null=False, blank=False, verbose_name="Mes", help_text="")

    # There will be always one and only one InvoicingMonth open
    is_open = models.BooleanField(
        null=False, blank=False, default=True, verbose_name="Mes", help_text=""
    )

    # null debería ser falso pero para evitar problemas con las fixtures
    # https://groups.google.com/forum/#!topic/django-users/Zfqx-kEE2uY
    # https://code.djangoproject.com/ticket/28951
    created_at = models.DateTimeField(null=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, auto_now=True)

    def __str__(self):
        return f"{self.anho} - {self.mes} - {self.is_open}"

    def save(self, **kwargs) -> None:
        self.full_clean()
        return super().save(**kwargs)
