# Tecnologías Utilizadas en el Proyecto

## Introducción

Este documento describe las tecnologías principales que hacen funcionar nuestra aplicación. Aunque la usas como un programa de escritorio normal (haciendo doble clic en un icono), por dentro está construida con las mismas tecnologías que se usan para crear páginas web modernas y potentes.

Hemos elegido este enfoque híbrido porque nos permite ofrecer una experiencia de usuario rica y moderna, a la vez que facilitamos la instalación y el uso como si fuera una aplicación tradicional, lo que fundamentalmente permite ofrecer una solución que no depende de tener conexión a Internet.

Pensemos en la aplicación como si tuviera tres grandes partes:

1.  **El "Cerebro" (Backend)**: La parte que procesa los datos y hace todo el trabajo pesado.
2.  **La "Cara" (Frontend)**: Lo que ves en la pantalla y con lo que interactúas.
3.  **El "Paquete" (Escritorio)**: Lo que envuelve todo para que funcione como una aplicación en tu ordenador.

A continuación, explicamos qué tecnología usamos para cada parte y por qué.

## 1. El Cerebro: Backend con Django (Python)

El motor de nuestra aplicación, la parte que no se ve pero que es fundamental, está construido con **Django**.

-   **¿Qué es?** Django es un entorno de trabajo (framework) basado en el lenguaje de programación Python. Es como una caja de herramientas muy completa y organizada para construir la lógica de una aplicación web.
-   **Analogía**: Si la aplicación fuera un restaurante, Django sería la cocina. Se encarga de recibir los pedidos (tus clics), preparar los platos (procesar la información), gestionar la despensa (la base de datos) y enviar el resultado de vuelta para que lo veas.
-   **¿Por qué lo elegimos?**
    -   **Rapidez y Eficiencia**: Django viene con muchas soluciones ya hechas para tareas comunes, lo que nos permite desarrollar más rápido y con menos errores.
    -   **Seguridad**: Incluye protección contra muchos de los problemas de seguridad más comunes en internet. La seguridad de tus datos es una prioridad.
    -   **Escalabilidad**: Está preparado para crecer. Si en el futuro la aplicación necesita gestionar muchos más datos o usuarios, Django puede manejarlo sin problemas.
    -   **Panel de Administración**: Django incluye un panel de control interno que facilita enormemente la gestión de los datos de la aplicación.

## 2. La Cara: Frontend con React (JavaScript)

Todo lo que ves y tocas en la pantalla está gestionado por **React**.

-   **¿Qué es?** React es una librería de JavaScript, el lenguaje universal de los navegadores web, creada por Facebook. Se especializa en construir interfaces de usuario interactivas.
-   **Analogía**: Siguiendo con la analogía del restaurante, React sería el comedor y la presentación de los platos. Se encarga de que la interfaz sea bonita, de que los menús se desplieguen correctamente y de que todo se actualice al instante sin tener que recargar la página entera. Lo hace construyendo la interfaz a base de pequeñas piezas reutilizables (componentes), como si fueran bloques de LEGO.
-   **¿Por qué lo elegimos?**
    -   **Experiencia Fluida**: Permite que la aplicación se sienta muy rápida y receptiva, ya que actualiza solo las partes de la pantalla que cambian.
    -   **Organización y Reutilización**: Su sistema de componentes nos ayuda a mantener el código ordenado y a ser más eficientes, reutilizando elementos como botones o formularios en diferentes partes de la aplicación.
    -   **Comunidad y Soporte**: Es una de las tecnologías más populares del mundo, lo que garantiza que está bien probada y tiene un gran soporte detrás.

## 3. El Paquete: Empaquetado con Electron

Para que esta aplicación web (Django + React) se convierta en un programa que puedes instalar en tu ordenador, usamos **Electron**.

-   **¿Qué es?** Electron es una herramienta que permite empaquetar una aplicación web dentro de una "caja" que funciona como una aplicación de escritorio nativa.
-   **Analogía**: Electron es la empresa de "comida para llevar" de nuestro restaurante. Coge la cocina (Django) y el comedor (React), los mete en un paquete robusto y te lo entrega en casa (tu escritorio) para que solo tengas que abrirlo y disfrutar. Este paquete ya incluye todo lo necesario para funcionar, sin que necesites un navegador web aparte.
-   **¿Por qué lo elegimos?**
    -   **Multiplataforma**: Nos permite usar el mismo código para crear versiones de la aplicación que funcionan en Windows, macOS y Linux. Esto ahorra una enorme cantidad de tiempo y esfuerzo.
    -   **Tecnologías Web**: Podemos aprovechar todas las ventajas y la potencia de las tecnologías web modernas (como React) para crear la interfaz.
    -   **Experiencia Integrada**: Aunque por dentro es una aplicación web, puede hacer cosas propias de una aplicación de escritorio, como mostrar notificaciones o acceder a tus archivos (siempre con tu permiso).

## 4. Componentes Clave y Decisiones de Implementación

Además de las tres grandes partes, hay algunas piezas importantes que merece la pena mencionar:

-   **Componentes visuales con MUI**: Para que la aplicación tenga un aspecto profesional y coherente, usamos **MUI** (antes Material-UI). Es una colección de componentes de React (botones, menús, tablas, etc.) listos para usar y con un diseño cuidado. Esto nos permite construir una interfaz bonita y funcional de manera mucho más rápida.

-   **Comunicación Frontend-Backend con Django REST Framework**: Para que la "Cara" (React) y el "Cerebro" (Django) hablen entre sí, utilizamos **Django REST Framework**. Esta herramienta amplía Django para crear de forma sencilla y estandarizada una "API REST", que es un conjunto de reglas y puntos de acceso para que el frontend pueda solicitar y enviar datos al backend de forma segura y predecible.

-   **Generación de facturas con `docx-templates`**: Una de las funciones clave de la aplicación es generar facturas. Para ello, usamos una librería de JavaScript llamada **`docx-templates`**. Nos permite crear plantillas de documentos de Word (`.docx`) y rellenarlas con los datos de la aplicación (nombre del cliente, importe, etc.) para generar facturas personalizadas y editables.

-   **Servidor web interno: El servidor de desarrollo de Django**: La aplicación incluye su propio servidor web, que es el que proporciona Django por defecto (`manage.py runserver`). Este servidor es ligero y fácil de usar. Aunque no está pensado para soportar miles de conexiones simultáneas en un sitio web público, es la solución perfecta para una aplicación de escritorio como la nuestra, donde solo un usuario la utiliza a la vez. Es simple, fiable y no requiere ninguna configuración compleja.

-   **Base de datos con SQLite**: Toda la información de la aplicación (socios, facturas, pagos) se guarda en una base de datos **SQLite**.
    -   **¿Qué es?** A diferencia de las grandes bases de datos que necesitan un servidor propio (como PostgreSQL o MySQL), SQLite guarda toda la información en un único fichero dentro del ordenador del usuario.
    -   **¿Por qué es ideal para nosotros?**
        -   **Portabilidad**: Al estar todo en un solo archivo, es muy fácil de gestionar, copiar y hacer copias de seguridad.
        -   **Cero configuración**: No requiere instalación ni administración. Simplemente funciona.
        -   **Eficiencia**: Es extremadamente rápida para el tipo de uso que le damos en una aplicación de escritorio.
        -   **Offline**: Es la opción perfecta para una aplicación que debe funcionar sin conexión a internet.

## 5. Aplicación Móvil Complementaria: Aigar-Lecturas

Para facilitar la toma de lecturas de los contadores en campo, el ecosistema se complementa con una aplicación para móviles Android llamada **Aigar-Lecturas**.

-   **¿Cómo funciona?** La aplicación de escritorio puede exportar un fichero con los datos de los contadores a leer. Este fichero se importa en la aplicación móvil, que permite introducir las nuevas lecturas de forma sencilla. Una vez terminado el trabajo, la aplicación móvil genera otro fichero con los datos actualizados, que se importa de nuevo en la aplicación de escritorio para actualizar la base de datos.

-   **Tecnología utilizada**: Se trata de una aplicación sencilla pero funcional, desarrollada con tecnologías web probadas y muy extendidas:

    -   **Cordova**: Es una herramienta que, de forma similar a Electron, empaqueta una aplicación web (HTML, CSS, JavaScript) para que se pueda instalar y ejecutar como una aplicación nativa en móviles Android.
    -   **jQuery y Bootstrap**: Para la interfaz y la lógica de la aplicación móvil, se utilizan estas dos librerías clásicas de JavaScript. **jQuery** simplifica la manipulación de la página y la interacción con el usuario, mientras que **Bootstrap** proporciona un conjunto de estilos y componentes visuales para que la aplicación tenga un diseño limpio y adaptable a diferentes tamaños de pantalla.

-   **¿Por qué esta elección?** Para una tarea tan específica como la toma de lecturas, no se requería una aplicación compleja. La elección de Cordova, jQuery y Bootstrap permitió desarrollar rápidamente una solución robusta y fácil de usar, centrada en cumplir su objetivo de forma eficiente y sin necesidad de una conexión a internet permanente.

## Resumen

En definitiva, hemos construido un ecosistema de software que combina lo mejor de varios mundos:

-   La robustez, seguridad y potencia de **Django** para gestionar los datos en la aplicación principal.
-   La flexibilidad y fluidez de **React** para crear una interfaz de usuario de escritorio agradable y moderna.
-   La versatilidad de **Electron** para empaquetarlo todo en una aplicación de escritorio fácil de usar y distribuir.
-   Una aplicación móvil complementaria, **Aigar-Lecturas**, construida con **Cordova** para facilitar el trabajo de campo de forma sencilla y offline.

Esta elección de tecnologías, complementada con herramientas específicas como **MUI**, **Django REST Framework**, **`docx-templates`** y **SQLite**, nos permite ofrecer una solución completa, eficiente y fácil de mantener, garantizando una gran experiencia para el usuario final.
