"""ForthcomingInvoiceItem. Gestiona items que serán cargados en futuras facturaciones.

No representa facturas enteras si no items (deudas, plazos, derechos, ...) que serán
cargados en la factura del siguiente (o posteriores) InvoicingMonth.

El valor asociado no tiene porqué coincidir con el valor total del derecho o de la
deuda, si no con el remanente.

https://www.dictionary.com/browse/forthcoming
"""

from django.db import models


class ForthcomingInvoiceItem(models.Model):
    class Meta(object):
        verbose_name = "concepto a facturar en siguientes meses"
        verbose_name_plural = "conceptos a facturar en siguientes meses"
        ordering = ("id",)
        constraints = [
            models.UniqueConstraint(
                name="%(app_label)s_%(class)s_unique_member_item",  # noqa: WPS323
                violation_error_message="Ya existe el concepto para esa socia",
                fields=["member", "item"],
            )
        ]

    created_at = models.DateTimeField(null=False, auto_now_add=True)
    updated_at = models.DateTimeField(null=False, auto_now=True)

    item = models.CharField(
        null=False, blank=False, max_length=256, verbose_name="concepto", help_text=""
    )

    value = models.FloatField(
        null=False, blank=False, verbose_name="valor", help_text=""
    )

    member = models.ForeignKey(
        "Member",
        null=False,
        blank=False,
        on_delete=models.CASCADE,
        verbose_name="socia",
        help_text="",
    )
