#!/bin/bash

this_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)"

source "${this_dir}"/../server/variables.ini

create_super_admin() {
    DJANGO_SUPERUSER_PASSWORD="${DJANGO_SUPERUSER_PASSWORD}" python "${this_dir}/../back/manage.py" createsuperuser --no-input --username admin --email=admin@example.com
}

empty() {
    create_super_admin
}

crear_iniciar() {
    cp "${this_dir}/../tools/fixtures/_db.sqlite3" "${SQLITE_PATH}"
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
measurements() {
    payments
    sqlite3 "${SQLITE_PATH}" "
        PRAGMA foreign_keys = ON;
        delete from app_measurement where invoice_id in (select id from app_invoice where mes_facturacion_id = '202405');
        update app_invoice set estado = 'nueva', caudal_actual = null, total=null, cuota_variable=0  where mes_facturacion_id = '202405';
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
payments() {
    cp tools/fixtures/aguamar/240705_db.sqlite3 "${SQLITE_PATH}"
    sqlite3 "${SQLITE_PATH}" "
        PRAGMA foreign_keys = ON;

        -- valorar borrar el último id en lugar de un mes
        delete from app_measurement where invoice_id in (select id from app_invoice where mes_facturacion_id = '202406');
        delete from app_payment where invoice_id in (select id from app_invoice where mes_facturacion_id = '202406');
        delete from app_invoice where mes_facturacion_id = '202406';
        delete from app_invoicingmonth where id_mes_facturacion = '202406';

        update app_invoicingmonth set is_open = true where id_mes_facturacion = '202405';
        delete from app_payment where invoice_id in (select id from app_invoice where mes_facturacion_id = '202405');


        update app_measurement set invoice_id = 300 where id = 294;
        delete from app_invoice where id = 417;

        update app_invoice set estado = 'pendiente_de_cobro', ontime_payment = 0, late_payment = 0  where mes_facturacion_id = '202405';

        update app_invoice set caudal_actual = 353 + 31 where anho = '2024' and mes = '05' and member_id = 6;
    "
}

case "${1}" in
    empty)
        echo "Creando base de datos vacia"
        empty
        ;;
    iniciar)
        echo "Creando base de datos para Iniciar proceso"
        crear_iniciar
        ;;
    measurements)
        echo "Creando base de datos para Importar lecturas"
        measurements
        ;;
    imprimir)
        echo "Creando base de datos para Imprimir facturas"
        crear_imprimir
        ;;
    payments)
        echo "Creando base de datos para Actualizar pagos"
        payments
        ;;
    '')
        echo ""
        empty
        ;;
    *)
        echo "Error. Parámetro no reconocido"
        exit 1
        ;; # In case you typed a different option other than a,b,c
esac
