from django.db import models


class InvoiceStatus(models.TextChoices):
    NUEVA = "nueva"
    PENDIENTE_DE_COBRO = "pendiente_de_cobro"
    COBRADA = "cobrada"
    NO_COBRADA = "no_cobrada"
    ANULADA = "anulada"


NOT_MODIFICABLE_INVOICES = (
    InvoiceStatus.ANULADA,
    InvoiceStatus.COBRADA,
    InvoiceStatus.NO_COBRADA,
)
