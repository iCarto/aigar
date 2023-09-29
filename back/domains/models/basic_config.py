"""BasicConfig. Configuración básica.

* Nombre de la JA
* Hay csv bancario

No permitimos configurar la "carpeta de la base de datos". Esta carpeta será donde se
almacene la base de datos y otra información como los logos o la plantilla de facturas.
La configuramos como el MEDIA_ROOT para que se pueda servir la información fácilmente.

En principio la ubicaremos en el directorio estándar para estas tareas en Windows

%APPDATA%/aigar_data


Al preparar la aplicación desde ASAPS la idea sería (por ahora) que crearan la carpeta
a mano, metieran un db.sqlite3 vacío, un logo.png y la plantilla. Abren la aplicación,
la configuran, la zipean. Y a la JA le pasan esa carpeta y se la ponen luego en su
ordenador y le pasan también el zip de la aplicación.

Logos. Tendremos uno génerico totalmente transparente del tamaño adecuado.
"""


from django.db import models

from back.fields import StrictCharField


class BasicConfig(models.Model):
    class Meta(object):
        verbose_name_plural = "Configuración básica"
        verbose_name = "Configuración básica"

    name = StrictCharField(
        null=False,
        blank=False,
        verbose_name="Nombre de la Junta de Agua",
        help_text="Nombre de la Junta de Agua como desea que aparezca en las facturas",
        unique=True,
        min_length=3,
    )

    payments_csv = models.BooleanField(
        null=False,
        blank=False,
        default=False,
        verbose_name="Importar pagos en CSV",
        help_text="Marque esta casilla si los pagos se importarán mediante un CSV generado por el banco",
    )

    def __str__(self):
        return f"{self.name} {self.payments_csv}"
