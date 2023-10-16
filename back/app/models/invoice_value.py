from django.db import models


class InvoiceValue(models.TextChoices):
    # name = value, label
    JORNADA_TRABAJO = "jornada_trabajo", "Jornada de trabajo"  # noqa: WPS115
    ASAMBLEA = "asamblea", "Inasistencia a Asamblea"  # noqa: WPS115
    COMISION = "comision", "Comisión de pago banco"  # noqa: WPS115
    CUOTA_FIJA = "cuota_fija", "Cuota fija"  # noqa: WPS115
    AHORRO = "ahorro", "Ahorro mano de obra"  # noqa: WPS115
