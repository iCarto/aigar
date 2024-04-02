# Proceso general de implantación

Imaginando que estamos en Marzo de 2024.

1. Revisión y diseño del catastro con las JA. Revisión de número de socias, orden de visita y demás información.
2. Actualización de la información en campo. Sobre todo medidores y censo de personas que habitan en la comunidad. Esto se puede realizar con los formularios preparados para la aplicación QField, a la espera de valorar un desarrollo a medida.
3. En la interfaz de gestión de AIGAR

    1. Se rellena `Comunidades` y `Configuración de AIGAR`. El pago se marca como manual (aunque luego se vaya a usar un csv)
    2. Se importa el catastro de socias. Se pueden usar los datos de QField.

4. Recopilación de información:

    - Lecturas y Recibos de febrero. Que tiene el caudal anterior (enero), el caudal actual (febrero) y el coste (factura de febrero)
    - Hay que tener en cuenta que los pagos son hasta el final de Marzo. Algunos se tendrán y otros no.

5. En la interfaz de gestión de AIGAR

    1. Se crea un nuevo `Mes de facturación`. Febrero de 2024
    2. Se exportan los recibos y se rellena la hoja de cálculo con los datos recopilados en el paso (4)
    3. Se importa la hoja de cálculo con los recibos actualizados

6. En la aplicación

    1. Exporto los socios. Para poder hacer las lecturas de medidores cuando toque (26 de Marzo)

7. En la aplicación a 1/Abril se comienza con el flujo normal
    1. Actualizolos pagos que faltan de febrero
    2. En caso de que se va a usar CSV tras actualizar los pagos de Febrero se puede ir a la configuración y activar esa opción
    3. Se crea un nuevo mes de facturación: Marzo de 2024
    4. Se importan las lecturas que se tomaron el 26 de Marzo
    5. Se imprimen las facturas

# Configuración inicial

Antes de usar la aplicación por primera vez y después de instalarla debe ser configurada.

Para ello, abrir la aplicación y esperar a que salga la pantalla.

A continuación abrir un navegador web y abrir la dirección

http://localhost:8000/gestion

Introducir como usuario `admin` y como contraseña `admin`.

Llegamos a un panel con diversas opciones. El orden en que se haga esto es fundamental y debe ser seguido el que aquí se menciona.

1. En `Comunidades` introducir las comunidades de la Junta de Agua. Los sectores serán creados automáticamente. Fíjese bien en los nombres de los sectores y anótelos para escribirlos exactamente igual en el catastro de usuarios.
2. Entre en cada una de las comunidades introducidas. Podrá introducir la fecha de lectura del medidor para cada sector.
3. En `Configuración de AIGAR` introduzca todos los parámetros obligatorios y los opciones que desee.
4. Cree un catastro de usuarios en formato hoja de cálculo. Compruebe que todo es correcto y .
    1. Puede crear una hoja en blanco exportando los `Socios/as`
    1. La columna estatus debe tener uno de los siguientes valores: `Activa`, `Inactiva`, `Eliminada`
    1. Compruebe que el nombre de los sectores es el que se usa en la aplicación
5. Cree un nuevo mes de facturación, correspondiente al mes anterior a aquel en que se quiera empezar a usar la aplicación. Esto generará automáticamente recibos para las socias activas. En caso de que haya socias con cuotas de derecho de conexión pendientes deben gestionarse a mano.
6. Exporte los recibos. Tendrán varios datos en blanco como el `caudal_actual`, ... rellénelo con los datos correctos
7. Importe la hoja de cálculo con los recibos actualizados en la aplicación
8. En caso de que haya cuotas de conexión o reconexión pendientes introduzcalas en `Conceptos a facturar en siguientes meses`

Con esto la aplicación está lista para ser usada. Cierre el navegador y la aplicación.

La carpeta `aigar_data` debe ser guardada e "instalada" en el ordenador de la Junta de Agua.

En la Junta de Agua trabaje de la forma normal, "Exportar socias" para proceder a realizar las lecturas del mes. Y luego "Iniciar proceso".

## Generar los recibos iniciales

Los pasos (6) y (7) enumerados antes permiten generar en la aplicación unos recibos iniciales, para que la aplicación pueda ser usada.

Los campos que se deben rellenar en la hoja de cálculo que se exporta/importa son los siguientes:

-   `id`. Es un campo interno para identificar el recibo. No hay que modificarlo.
-   `num_socio` y `member_name`. `Número de socio` y `Nombre del socio` para poder identificarlos en cada fila de la hoja de cálculo y rellenar el resto de datos. No hay que modificarlo.
-   `mes_facturacion`. Un código del mes para el que se van a generar estos recibos iniciales. No hay que modificarlo.
-   `caudal_anterior` y `caudal_actual`. Las lecturas de los contadores. Hay que introducir los valores adecuados.
-   `ontime_payment` y `late_payment`. El pago de recibo que ha realizado el socio dentro del plazo o con mora respectivamente. Se usan para calcular si el próximo recibo debe tener mora. Hay que introducir los valores adecuados
-   `total`. Es el coste total del recibo que haya calculado la Junta de Agua. Debe ser el valor final incluyendo todos los conceptos, cuota fija, cuota variable, comisiones, mora, inasistencia a asambleas, ... La aplicación mantendrá este valor total como el valor total del recibo. Y calculará automáticamente el resto de valores en función de como se haya configurado la aplicación:
    -   `Cuota fija`. Le asignará el valor que se haya introducido en la aplicación.
    -   `Cuota variable`. El valor que toque en función del consumo.
    -   `Ahorro`. Le asignará el valor que se haya introducido en la aplicación.
    -   `Comisión bancaria`. Le asignará el valor que se haya introducido en la aplicación.
    -   `Otros` será igual a `Total` - `Cuota fija` - `Cuota variable` - `Ahorro` - `Comisión bancaria`
-   `observaciones`. Por si se quiere añadir alguna nota. Puede quedar en blanco.
