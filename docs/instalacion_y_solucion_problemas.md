# Instalación inicial de AIGAR (Escritorio)

La aplicación se como dos ficheros comprimidos en zip:

-   **aammdd_AIGAR.zip**. Donde aammdd es la fecha en que se saca la versión. Por ejemplo `231030_AIGAR.zip` significa que es la versión de AIGAR de fecha 20 de Octubre de 2023. La aplicación se descomprimirá preferiblemente en C:\ y luego se creará un acceso directo en el escritorio a AIGAR.exe.

-   **aammdd_aigar_data.zip**. Es un directorio que debemos descomprimir en la carpeta `Mis Documentos`. Por ejemplo en `C:\Usuarios\<Mi Usuario>\Mis Documentos\aigar_data`. Dentro de esta carpeta estarán los siguientes archivos:
    -   db.sqlite3. Es la base de datos de la aplicación. Para hacer copias de seguridad copie este fichero a USB externo.
    -   plantilla_recibo.docx. Es la plantilla usada para imprimir recibos. Puede ser modificada si se conoce bien la sintaxis.
    -   logo.png. Es el logo de la Junta de Agua que se usará en las facturas impresas. El fichero que se proporciona por defecto debe ser substituido por el real de la Junta de Agua respetando el tamaño del fichero original: `191 x 191 px`

# Actualización de AIGAR (Escritorio)

Descargue la nueva versión de la aplicación **aammdd_AIGAR.zip**, elimine la anterior que esté en C:\ y descomprima esta en su lugar. Actualice la ruta del acceso directo.

# Resolución de Problemas

Ir a la carpeta `Python311/Lib/site-packages/aigar/` editar el fichero `.env` y poner `DEBUG=True`

Abrir una consola en el directorio donde está AIGAR.exe. Para ello:

```
Shift + Click Derecho espacio libre del navegador de archivos
Abrir Powershell Aquí
```

En la consola escribir:

```
./Python311/python.exe ./Python311/Lib/site-packages/aigar/manage.py runserver --noreload --nothreading
```

En el navegador ir a http://localhost:8000

Sacar captura del error que ponga tanto el navegador como la consola

Enviar las capturas junto al fichero `aigar_data\aigar.log` para depurar el problema.

## Limpiar ficheros antiguos

También en caso de problemas escribir en el explorador de archivos `%APPDATA%` y buscar en el directorio que abra y el directorio anterior en las carpetas `Local`, `Roaming` y similares carpetas o ficheros de nombres como `aigar_data`, `aigar`, `electron` y borrarlas.
