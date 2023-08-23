import {LinkCellTable} from "base/table/components";

import {InvoiceResumenCellTable, InvoiceStatusCellTable} from "invoice/presentational";
import {MemberStatusCellTable} from "member/presentational";

export function useMonthlyInvoicingTableColumns() {
    const tableColumns = [
        {
            id: "tipo_socio",
            formatFunction: item => {
                return <MemberStatusCellTable status={item.tipo_socio} showOnlyIcons />;
            },
            style: {textAlign: "center"},
        },
        {
            label: "Socio",
            id: "nombre",
            formatFunction: item => {
                return (
                    <LinkCellTable
                        text={item.nombre}
                        to={`/socios/${item.num_socio}`}
                    />
                );
            },
        },
        {
            label: "Sector",
            id: "sector",
        },
        {
            label: "Nº Factura",
            id: "numero",
            formatFunction: item => {
                return (
                    <LinkCellTable
                        text={item.numero}
                        to={`/facturas_mes/${item.id_factura}`}
                    />
                );
            },
        },
        {
            label: "Lectura",
            id: "consumo",
            className: "cubic-metre",
            style: {textAlign: "right"},
        },
        {
            label: "Importe",
            id: "total",
            className: "dollar font-weight-bold",
            style: {textAlign: "right"},
        },
        {
            label: "Estado",
            id: "estado",
            formatFunction: item => {
                return <InvoiceStatusCellTable value={item.estado} />;
            },
        },
        {
            label: "Meses previos",
            id: "resumen",
            formatFunction: item => {
                return <InvoiceResumenCellTable value={item.resumen} />;
            },
            style: {textAlign: "center"},
        },
    ];

    return {tableColumns};
}
