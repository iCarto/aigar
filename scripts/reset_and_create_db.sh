#!/bin/bash

this_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)"

source "${this_dir}"/../server/variables.ini

reset_django_migrations() {
    # Eliminamos todo para restaurarlo de cero y creamos una bd limpia
    rm -f db.sqlite3
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

# Si se pasa cualquier parámetro a este comando crea una base de datos vacía
CREATE_EMPTY="${1}"

if [[ -f back/manage.py ]]; then
    reset_django_migrations
fi

# TODO: Revisar como hacer esto de forma adecuada (funciones?, script?)
# bash "${this_dir}/../server/drop_and_create_db.sh"

bash "${this_dir}"/install.link_back_front.sh

if [[ -z "${CREATE_EMPTY}" ]]; then
    "${this_dir}"/fixtures.sh
fi

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

    sqlite3 back/db.sqlite3 "
        PRAGMA foreign_keys = ON;

        INSERT INTO domains_locality (name, short_name, number_of_sectors) VALUES
            ('Tihuapa norte', 'Tihuapa norte', 4)
            , ('Tlacuxtli', 'Tlacuxtli', 3)
        ;

        INSERT INTO domains_zone (name, code, locality_short_name) VALUES
            ('1 - Tihuapa norte', '1', 'Tihuapa norte')
            , ('2 - Tihuapa norte', '2', 'Tihuapa norte')
            , ('3 - Tihuapa norte', '3', 'Tihuapa norte')
            , ('4 - Tihuapa norte', '4', 'Tihuapa norte')
            , ('5 - Tlacuxtli', '5', 'Tlacuxtli')
            , ('6 - Tlacuxtli', '6', 'Tlacuxtli')
            , ('7 - Tlacuxtli', '7', 'Tlacuxtli')
        ;

        INSERT INTO back_member
            (
                num_socio, name, sector_id, medidor, solo_mecha, orden, observaciones, consumo_maximo, consumo_reduccion_fija, created_at, updated_at, is_active
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
                , medidor, solo_mecha, orden, observaciones, consumo_maximo, consumo_reduccion_fija, created_at, updated_at, is_active
            FROM api_member;


        INSERT INTO back_invoicingmonth
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

        INSERT INTO back_invoice
        (
            id_factura, version, nombre, anho, mes_facturado, mes_limite, anho_limite, caudal_anterior, caudal_actual, consumo, cuota_fija, cuota_variable, comision, ahorro, mora, derecho, reconexion, asamblea, traspaso, saldo_pendiente, descuento, otros,  total, estado, observaciones, entrega, pago_1_al_10, pago_11_al_30, created_at, updated_at, is_active, member_id, mes_facturacion_id, sector_id
        )
        SELECT
            id_factura, version, nombre, anho, mes_facturado, mes_limite, anho_limite, caudal_anterior, caudal_actual, consumo, cuota_fija, cuota_variable, comision, ahorro, mora, derecho, reconexion, asamblea, traspaso, saldo_pendiente, descuento, otros,  total, estado, observaciones, entrega, pago_1_al_10, pago_11_al_30, created_at, updated_at, is_active, member_id, mes_facturacion_id, CASE sector
                    WHEN 1 THEN '1 - Tihuapa norte'
                    WHEN 2 THEN '2 - Tihuapa norte'
                    WHEN 3 THEN '3 - Tihuapa norte'
                    WHEN 4 THEN '4 - Tihuapa norte'
                    WHEN 5 THEN '5 - Tlacuxtli'
                    WHEN 6 THEN '6 - Tlacuxtli'
                    WHEN 7 THEN '7 - Tlacuxtli'
                END
            FROM api_invoice;
        DROP TABLE api_invoice;
        DROP TABLE api_invoicingmonth;
        DROP TABLE api_member;

        INSERT INTO back_measurement
        (
            id_lectura,
            caudal_anterior,
            caudal_actual,
            consumo,
            cambio_medidor,
            medidor,
            created_at,
            updated_at,
            factura_id,
            mes_facturacion_id
        )
        SELECT
            id_lectura,
            caudal_anterior,
            caudal_actual,
            consumo,
            cambio_medidor,
            medidor,
            created_at,
            updated_at,
            factura_id,
            mes_facturacion_id
        FROM api_measurement;
        DROP TABLE api_measurement;

        INSERT INTO back_payment
        (
            id_pago,
            fecha,
            monto,
            created_at,
            updated_at,
            factura_id,
            mes_facturacion_id
        )
        SELECT
            id_pago,
            fecha,
            monto,
            created_at,
            updated_at,
            factura_id,
            mes_facturacion_id
        FROM api_payment;
        DROP TABLE api_payment;
        "
fi

if [[ -f ${this_dir}/../back/manage.py ]]; then
    DJANGO_SUPERUSER_PASSWORD="${DJANGO_SUPERUSER_PASSWORD}" python "${this_dir}/../back/manage.py" createsuperuser --no-input --username admin
    # In install.sh static folders are created
    # At this point static assets are collected
    python "${this_dir}/../back/manage.py" collectstatic --no-input --clear --verbosity 0
fi
