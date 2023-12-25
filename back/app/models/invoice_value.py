from django.db import models


class InvoiceValue(models.TextChoices):
    # name = value, label
    JORNADA_TRABAJO = "jornada_trabajo", "Jornada de trabajo"
    ASAMBLEA = "asamblea", "Inasistencia a Asamblea"
    COMISION = "comision", "Comisión de pago banco"
    CUOTA_FIJA = "cuota_fija", "Cuota fija"
    AHORRO = "ahorro", "Ahorro mano de obra"
