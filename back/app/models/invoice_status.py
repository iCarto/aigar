from django.db import models


class InvoiceStatus(models.TextChoices):
    NUEVA = "nueva"  # noqa: WPS115
    PENDIENTE_DE_COBRO = "pendiente_de_cobro"  # noqa: WPS115
    COBRADA = "cobrada"  # noqa: WPS115
    NO_COBRADA = "no_cobrada"  # noqa: WPS115
    ANULADA = "anulada"  # noqa: WPS115


NOT_MODIFICABLE_INVOICES = (
    InvoiceStatus.ANULADA,
    InvoiceStatus.COBRADA,
    InvoiceStatus.NO_COBRADA,
)
