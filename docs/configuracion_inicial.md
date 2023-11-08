# Configuración inicial

Antes de usar la aplicación por primera vez y después de instalarla debe ser configurada.

Para ello, abrir la aplicación y esperar a que salga la pantalla.

A continuación abrir un navegador web y abrir la dirección

http://localhost:8000/gestion

Introducir como usuario `admin` y como contraseña `admin`.

Llegamos a un panel con diversas opciones. El orden en que se haga esto es fundamental y debe ser seguido el que aquí se menciona.

1. En `Comunidades` introducir las comunidades de la Junta de Agua. Los sectores serán creados automáticamente. Fíjese bien en los nombres de los sectores y anótelos para escribirlos exactamente igual en el catastro de usuarios.
2. En `Configuración de AIGAR` introduzca todos los parámetros obligatorios y los opciones que desee.
3. Cree un catastro de usuarios en formato hoja de cálculo. Compruebe que todo es correcto y .
    1. Puede crear una hoja en blanco exportando los `Socios`
    1. La columna estatus debe tener uno de los siguientes valores: `Activa`, `Inactiva`, `Eliminada`
    1. Compruebe que el nombre de los sectores es el que se usa en la aplicación
4. Cree un nuevo mes de facturación, correspondiente al mes anterior a aquel en que se quiera empezar a usar la aplicación. Esto generará automáticamente facturas para las socias activas. En caso de que haya socias con cuotas de derecho de conexión pendientes deben gestionarse a mano.
5. Exporte las facturas. Tendrán varios datos en blanco como el `caudal_actual`, ... rellénelo con los datos correctos
6. Importe las facturas
7. En caso de que haya cuotas de conexión o reconexión pendientes introduzcalas en `Conceptos a facturar en siguientes meses`

Con esto la aplicación está lista para ser usada. Cierre el navegador y la aplicación.

La carpeta `aigar_data` debe ser guardada e "instalada" en el ordenador de la Junta de Agua.

En la Junta de Agua trabaje de la forma normal, "Exportar socias" para proceder a realizar las lecturas del mes. Y luego "Iniciar facturación".
