"""Estados de las socias del sistema.

Cuando se inicia el proyecto de agua, las personas de la comunidad muestran su interés
en participar. Durante la construcción, las personas que mostraron interés (que son un
90-95% pero no todas) participan en la construcción. Estas serán las acometidas (mechas)
del sistema y las personas se comprometen a participar en X jornadas de trabajo (hacer
zanjas para la tubería, construcción del tanque, ...). Estas personas son la lista de
socias "iniciales" que "pagaron" estar dentro del proyecto con su trabajo.

Cuando el SAPS está construido se empieza a dar agua y cobrar. Pero en ese momento, hay
socias que tienen acometidas pero no quieren agua en ese momento (no tienen casa, no
viven continuamente, ...). Y a medida que pasa el tiempo tenemos más situaciones:

Por tanto los tipos de socias serían:

1. **Activas**. A veces llamamos a estas socias `Conectadas`. Se les da agua y se les
   cobra mensualmente. Han pagado el `derecho de conexión` bien con su trabajo bien
   mediante dinero.
2. **Inactivas**. A veces llamamos a estas socias `Desconectadas`. No se les da agua ni
   se les cobra, pero ya han pagado el `derecho de conexión`. Para pasar a activa
   tendrán que pagar el `derecho de reconexión`. Una socia estará inactiva en general
   por dos motivos:
   1. Estaban entre las socias iniciales, pagaron la conexión con su trabajo, pero no
      querían agua en ese momento.
   2. Antes estaban `Activas` pero por algún motivo se desconectaron del sistema:
      * Ya no quieren agua. Tienen la casa pero ya no vive nadie, ...
      * Han sido multadas. Si no siguen la normativa de la SAPS las desconectan. Por
        ejemplo, roban el agua de otro lado o el más común que no pagan en 3 meses.
3. **Eliminadas**. Es un caso poco común, ya que normalmente las casas siguen estando.
   Si muere una persona o vende la casa, se cambia el nombre de la socia y se cobra el
   `cambio de nombre` (un pago aun más pequeno que el derecho a reconexión). Pero si ya no se prevee que viva nadie, o es una socia que
   lleva mucho tiempo `Inactiva` y no tiene casa, pueden eliminarla. Las socias
   `Eliminadas` no pueden reincorporarse. Si por algún motivo la misma persona quiere
   volver tendrá que incorporarse como nueva socia: nuevo numero de socia y pago del
   `derecho de conexión`.


Otras aclaraciones

* Haber pagado el derecho de conexión en general significa que la socia tiene acometida
  (mecha)
* Nuevas socias. Como no trabajaron (porque aun no tenían casa en la comunidad o no
  quisieron entrar en el proyecto) tienen que pagar el `derecho de conexión` para
  incorporarse como `Activas`.
* El `derecho de reconexión` es una cantidad pequeña, se cobra en el primer recibo que
  se emite y no es necesario pagarlo a plazos.
* Sólo las `Activas` se exportan a a la aplicación móvil. El fontanero es quien revisa
  las acometidas y que no esté consumiendo agua una `Inactiva`
* La nomenclatura de conectar se refiere al hecho fisico de que los fontaneros conectan
  la mecha al sistema.
* Consideran desactivar a los que eran solo mecha y desconectar a los que les cortan el
  sistema. De las dos nomenclaturas seleccionaron desactivar.
"""

from django.db import models


class MemberStatus(models.TextChoices):
    ACTIVE = "Activa", "Activa"
    INACTIVE = "Inactiva", "Inactiva"
    DELETED = "Eliminada", "Eliminada"
