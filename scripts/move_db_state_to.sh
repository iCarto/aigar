#!/bin/bash

this_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)"

source "${this_dir}"/../server/variables.ini

crear_vacia() {
    sqlite3 "${SQLITE_PATH}" "
        PRAGMA foreign_keys = ON;
        delete from app_measurement;
        delete from app_payment;
        delete from app_invoice;
        delete from app_invoicingmonth;
        delete from app_member;
        delete from domains_zone;
        delete from domains_locality;
        delete from domains_aigarconfig;
    "
}

crear_iniciar() {
    sqlite3 "${SQLITE_PATH}" "
        PRAGMA foreign_keys = ON;
        delete from app_invoicingmonth where id_mes_facturacion = '202310';
        update app_invoicingmonth set is_open=True where id_mes_facturacion = '202309';
        delete from
            app_invoice
        where
            mes_facturacion_id = '202309'
            and
            member_id IN (SELECT id FROM app_member WHERE status = 'Inactiva')
        ;
        update app_invoice set
            estado = 'pendiente_de_cobro'
        where mes_facturacion_id = '202309' and estado = 'no_cobrada';

    "
}

crear_importar() {
    sqlite3 "${SQLITE_PATH}" "
        PRAGMA foreign_keys = ON;

        WITH mes(id) AS (
            SELECT id_mes_facturacion AS id FROM app_invoicingmonth ORDER BY id_mes_facturacion DESC LIMIT 1
        )
        , invoices(id) AS (
            SELECT app_invoice.id FROM app_invoice, mes WHERE mes_facturacion_id = mes.id
        )
        UPDATE app_invoice SET
            estado = 'nueva'
            , ontime_payment = 0
            , late_payment = 0
            , caudal_actual = null
        FROM mes
        WHERE mes_facturacion_id = mes.id;

        WITH mes(id) AS (
            SELECT id_mes_facturacion AS id FROM app_invoicingmonth ORDER BY id_mes_facturacion DESC LIMIT 1
        )
        , invoices(id) AS (
            SELECT app_invoice.id FROM app_invoice, mes WHERE mes_facturacion_id = mes.id
        )
        DELETE FROM app_payment
        WHERE invoice_id in (SELECT id FROM invoices);

        WITH mes(id) AS (
            SELECT id_mes_facturacion AS id FROM app_invoicingmonth ORDER BY id_mes_facturacion DESC LIMIT 1
        )
        , invoices(id) AS (
            SELECT app_invoice.id FROM app_invoice, mes WHERE mes_facturacion_id = mes.id
        )
        DELETE FROM app_measurement
        WHERE invoice_id in (SELECT id FROM invoices);
    "
}

crear_imprimir() {
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
        where mes_facturacion_id = '202309';
        delete from app_payment where
            invoice_id in (select id from app_invoice where mes_facturacion_id = '202309');
        delete from app_measurement where
            invoice_id in (select id from app_invoice where mes_facturacion_id = '202309');
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
        where mes_facturacion_id = '202309';
        delete from app_payment where
            invoice_id in (select id from app_invoice where mes_facturacion_id = '202309');
    "
}

case "${1}" in
    vacia)
        echo "Creando base de datos vacia"
        crear_vacia
        ;;
    iniciar)
        echo "Creando base de datos para Iniciar proceso"
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
