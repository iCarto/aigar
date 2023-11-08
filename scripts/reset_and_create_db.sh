#!/bin/bash

this_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)"

source "${this_dir}"/../server/variables.ini

reset_django_migrations() {
    # Eliminamos todo para restaurarlo de cero y creamos una bd limpia
    find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
    find . -path "*/migrations/*.pyc" -delete

    SITE_PACKAGES=$(python -c "from distutils.sysconfig import get_python_lib; print(get_python_lib())")

    # Eliminamos también las migraciones de los paquetes de django que utilicemos
    # para que no se creen migraciones intermedias
    find "${SITE_PACKAGES}/django/contrib/auth" -path "*/migrations/*.py" -not -name "__init__.py" -delete
    find "${SITE_PACKAGES}/django/contrib/auth" -path "*/migrations/*.pyc" -delete
    find "${SITE_PACKAGES}/django/contrib/admin" -path "*/migrations/*.py" -not -name "__init__.py" -delete
    find "${SITE_PACKAGES}/django/contrib/admin" -path "*/migrations/*.pyc" -delete
    find "${SITE_PACKAGES}/django/contrib/contenttypes" -path "*/migrations/*.py" -not -name "__init__.py" -delete
    find "${SITE_PACKAGES}/django/contrib/contenttypes" -path "*/migrations/*.pyc" -delete
}

if [[ -f back/manage.py ]]; then
    reset_django_migrations
fi

# TODO: Revisar como hacer esto de forma adecuada (funciones?, script?)
# bash "${this_dir}/../server/drop_and_create_db.sh"

bash "${this_dir}"/install.link_back_front.sh

rm -f "${SQLITE_PATH}"
"${this_dir}"/fixtures.sh

if [[ "${DATABASE_CONTROL_CHANGES_MODE}" == "sqitch" ]]; then
    (
        cd "${this_dir}/../db" || exit
        sqitch deploy
    )
else
    # Crea las migraciones. migrations/__init__.py debe existir para que se cree la
    # migración inicial de una app o debe invocarse la app de forma concreta
    # python manage.py makemigrations users
    python "${this_dir}/../back/manage.py" makemigrations
    # Ejecuta las migraciones contra la bd
    python "${this_dir}/../back/manage.py" migrate

    sqlite3 "${SQLITE_PATH}" "

    /* https://stackoverflow.com/a/48016934/930271 */
    PRAGMA writable_schema = ON;

    UPDATE sqlite_master SET
        sql = replace(sql, 'DEFERRABLE', 'ON DELETE CASCADE DEFERRABLE')
    WHERE
        type='table'
        AND
        name IN ('app_invoice', 'app_measurement', 'app_payment', 'app_forthcominginvoiceitem');

    PRAGMA writable_schema = OFF;


    PRAGMA foreign_keys = ON;

    /* cuota_variable_cuarto_tramo_cantidad, cuota_variable_cuarto_tramo_coste */
    /* comercial_cuota_variable_cuarto_tramo_cantidad, comercial_cuota_variable_cuarto_tramo_coste */
    INSERT INTO domains_aigarconfig
        (
            id, name, payment_csv, payment_due_day, payment_method
            , recargo_mora, reconexion, traspaso_derecho, humano_nuevo_derecho_total, humano_nuevo_derecho_primera_cuota, comercial_nuevo_derecho_total, comercial_nuevo_derecho_primera_cuota
            , asamblea, jornada_trabajo
            , comision
            , humano_cuota_fija, comercial_cuota_fija
            , ahorro
            , humano_cuota_variable_primer_tramo_cantidad, humano_cuota_variable_primer_tramo_coste, humano_cuota_variable_segundo_tramo_cantidad, humano_cuota_variable_segundo_tramo_coste, humano_cuota_variable_tercer_tramo_cantidad, humano_cuota_variable_tercer_tramo_coste, humano_cuota_variable_cuarto_tramo_cantidad, humano_cuota_variable_cuarto_tramo_coste
            , comercial_cuota_variable_primer_tramo_cantidad, comercial_cuota_variable_primer_tramo_coste, comercial_cuota_variable_segundo_tramo_cantidad, comercial_cuota_variable_segundo_tramo_coste, comercial_cuota_variable_tercer_tramo_cantidad, comercial_cuota_variable_tercer_tramo_coste, comercial_cuota_variable_cuarto_tramo_cantidad, comercial_cuota_variable_cuarto_tramo_coste
            , nuevo_derecho_siguientes_cuotas_opcion1, nuevo_derecho_siguientes_cuotas_opcion2, nuevo_derecho_siguientes_cuotas_opcion3, nuevo_derecho_siguientes_cuotas_opcion4, nuevo_derecho_siguientes_cuotas_opcion5, nuevo_derecho_siguientes_cuotas_opcion6
        )
    VALUES
        (
            1, 'Junta de Agua', 0, 16, 'BANCO .... Cuenta No: .... '
            , '1.00', '10.00', '0.00', '300.00', '100.00', '400.00', '150.00'
            , '2.00', '2.00'
            , '0.28'
            , '5.72', '5.72'
            , '0.25'
            , 14, 0, 20, '0.75', NULL, '2', NULL, '0'
            , 14, 0, 20, '0.75', NULL, '2', NULL, '0'
            , '10', '25', '50', '75', '100', '150'
        )
    ;



    INSERT INTO domains_locality (name, short_name, number_of_sectors) VALUES
        ('Tihuapa norte', 'Tihuapa norte', 4)
        , ('Tlacuxtli', 'Tlacuxtli', 3)
    ;

    INSERT INTO domains_zone (name, code, locality_short_name, reading_day) VALUES
        ('1 - Tihuapa norte', '1', 'Tihuapa norte', 27)
        , ('2 - Tihuapa norte', '2', 'Tihuapa norte', 27)
        , ('3 - Tihuapa norte', '3', 'Tihuapa norte', 27)
        , ('4 - Tihuapa norte', '4', 'Tihuapa norte', 27)
        , ('5 - Tlacuxtli', '5', 'Tlacuxtli', 27)
        , ('6 - Tlacuxtli', '6', 'Tlacuxtli', 27)
        , ('7 - Tlacuxtli', '7', 'Tlacuxtli', 27)
    ;

    /* #4234-16 */
    WITH
        socias AS (
        SELECT num_socio FROM api_member WHERE NOT is_active OR solo_mecha
    )
    , invoices as (
        SELECT id_factura FROM api_invoice WHERE member_id IN (SELECT num_socio FROM socias) AND estado = 'nueva'
    )
    DELETE FROM api_measurement WHERE factura_id IN (SELECT id_factura FROM invoices);

    DELETE FROM api_invoice WHERE member_id IN (SELECT num_socio FROM api_member WHERE NOT is_active OR solo_mecha) AND estado = 'nueva';

    INSERT INTO app_member
        (
            id, name, sector_id, medidor, orden, observaciones, consumo_maximo, consumo_reduccion_fija
            , tipo_uso
            , created_at, updated_at
            , status
        )
        SELECT
            num_socio, name
            , CASE sector
                WHEN 1 THEN '1 - Tihuapa norte'
                WHEN 2 THEN '2 - Tihuapa norte'
                WHEN 3 THEN '3 - Tihuapa norte'
                WHEN 4 THEN '4 - Tihuapa norte'
                WHEN 5 THEN '5 - Tlacuxtli'
                WHEN 6 THEN '6 - Tlacuxtli'
                WHEN 7 THEN '7 - Tlacuxtli'
            END

            , medidor, orden, observaciones, consumo_maximo, consumo_reduccion_fija
            , 'Humano'
            , COALESCE(created_at, datetime('now')), COALESCE(updated_at, datetime('now'))
            , CASE
                WHEN NOT is_active THEN 'Eliminada'
                WHEN solo_mecha THEN 'Inactiva'
                ELSE 'Activa'
            END
        FROM api_member;


    INSERT INTO app_invoicingmonth
    (
        id_mes_facturacion,
        anho,
        mes,
        is_open,
        created_at,
        updated_at
    )
    SELECT
        id_mes_facturacion,
        anho,
        mes,
        is_open,
        created_at,
        updated_at
    FROM api_invoicingmonth;

    INSERT INTO app_invoice
    (
        id, version, anho, mes, caudal_anterior, caudal_actual, cuota_fija, cuota_variable, comision, ahorro, mora, derecho, reconexion, asamblea, traspaso, saldo_pendiente, descuento, otros,  total, estado, observaciones, created_at, updated_at, member_id, mes_facturacion_id
        , jornada_trabajo
        , ontime_payment, late_payment
    )
    SELECT
        id_factura, version, printf('%02.0f', anho), printf('%02.0f', mes_facturado), caudal_anterior, caudal_actual, cuota_fija, cuota_variable, comision, ahorro, mora, derecho, reconexion, asamblea, traspaso, saldo_pendiente, descuento, otros,  total, estado, observaciones, created_at, updated_at, member_id, mes_facturacion_id
        , 0
        , COALESCE(pago_1_al_10, 0), COALESCE(pago_11_al_30, 0)
        FROM api_invoice;

    INSERT INTO app_measurement
    (
        id
        , caudal_anterior
        , caudal_actual
        , cambio_medidor
        , medidor
        , created_at
        , updated_at
        , invoice_id
    )
    SELECT
        id_lectura
        , caudal_anterior
        , caudal_actual
        , cambio_medidor
        , medidor
        , created_at
        , updated_at
        , factura_id
    FROM api_measurement;


    INSERT INTO app_payment
    (
        id
        , fecha
        , monto
        , created_at
        , updated_at
        , invoice_id
    )
    SELECT
        id_pago
        , fecha
        , monto
        , created_at
        , updated_at
        , factura_id
    FROM api_payment;
    DROP TABLE api_measurement;
    DROP TABLE api_payment;
    DROP TABLE api_invoice;
    DROP TABLE api_invoicingmonth;
    DROP TABLE api_member;
    "
fi

if [[ -f ${this_dir}/../back/manage.py ]]; then
    DJANGO_SUPERUSER_PASSWORD="${DJANGO_SUPERUSER_PASSWORD}" python "${this_dir}/../back/manage.py" createsuperuser --no-input --username admin --email admin@example.com
    # In install.sh static folders are created
    # At this point static assets are collected
    python "${this_dir}/../back/manage.py" collectstatic --no-input --clear --verbosity 0
fi

crear_vacia() {
    sqlite3 "${SQLITE_PATH}" "
        PRAGMA foreign_keys = ON;
        delete from app_invoicingmonth;
        delete from app_member;
        delete from domains_aigarconfig;
        delete from domains_zone;
        delete from domains_locality;
    "
}

crear_iniciar() {
    sqlite3 "${SQLITE_PATH}" "
        PRAGMA foreign_keys = ON;
        delete from app_invoicingmonth where id_mes_facturacion = '202305';
        update app_invoicingmonth set is_open=True where id_mes_facturacion = '202304';
        delete from
            app_invoice
        where
            mes_facturacion_id = '202304'
            and
            member_id IN (SELECT id FROM app_member WHERE status = 'Inactiva')
        ;
        update app_invoice set
            estado = 'pendiente_de_cobro'
        where mes_facturacion_id = '202304' and estado = 'no_cobrada';

    "
}

crear_importar() {
    crear_iniciar
    sqlite3 "${SQLITE_PATH}" "
        PRAGMA foreign_keys = ON;
        update app_invoice set
            caudal_actual = null
            , cuota_variable = 0
            , asamblea = 0
            , jornada_trabajo = 0
            , traspaso = 0
            , descuento = 0
            , otros = 0
            , total = null
            , estado = 'nueva'
            , ontime_payment = 0
            , late_payment = 0
        where mes_facturacion_id = '202304';
        delete from app_payment where
            invoice_id in (select id from app_invoice where mes_facturacion_id = '202304');
        delete from app_measurement where
            invoice_id in (select id from app_invoice where mes_facturacion_id = '202304');
    "
}

crear_imprimir() {
    crear_iniciar

    sqlite3 "${SQLITE_PATH}" "
        PRAGMA foreign_keys = ON;
        update app_invoice set
            estado = 'nueva'
            , ontime_payment = 0
            , late_payment = 0
        where mes_facturacion_id = '202304';
        delete from app_payment where
            invoice_id in (select id from app_invoice where mes_facturacion_id = '202304');
    "
}

crear_actualizar() {
    crear_iniciar
    sqlite3 "${SQLITE_PATH}" "
        PRAGMA foreign_keys = ON;
        update app_invoice set
            estado = 'pendiente_de_cobro'
            , ontime_payment = 0
            , late_payment = 0
        where mes_facturacion_id = '202304';
        delete from app_payment where
            invoice_id in (select id from app_invoice where mes_facturacion_id = '202304');
    "
}

case "${1}" in
    vacia)
        echo "Creando base de datos vacia"
        crear_vacia
        ;;
    iniciar)
        echo "Creando base de datos para Iniciar facturación"
        crear_iniciar
        ;;
    importar)
        echo "Creando base de datos para Importar lecturas"
        crear_importar
        ;;
    imprimir)
        echo "Creando base de datos para Imprimir facturas"
        crear_imprimir
        ;;
    actualizar)
        echo "Creando base de datos para Actualizar pagos"
        crear_actualizar
        ;;
    '') echo "" ;;
    *)
        echo "Error. Parámetro no reconocido"
        exit 1
        ;; # In case you typed a different option other than a,b,c
esac
