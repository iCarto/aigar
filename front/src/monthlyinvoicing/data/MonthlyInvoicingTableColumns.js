import {LinkCellTable} from "base/table";

import {InvoiceResumenCellTable, InvoiceStatusCellTable} from "invoice/presentational";
import {MemberStatusCellTable} from "member/presentational";

export function useMonthlyInvoicingTableColumns() {
    const tableColumns = [
        {
            accessor: "tipo_socio",
            Cell: MemberStatusCellTable,
            className: "text-nowrap text-center",
            getProps: () => ({
                showOnlyIcons: true,
            }),
        },
        {
            Header: "Socio",
            accessor: "nombre",
            Cell: LinkCellTable,
            getProps: () => ({
                linkAccessor: "num_socio",
                path: "socios",
            }),
        },
        {
            Header: "Sector",
            accessor: "sector",
            className: "text-center",
        },
        {
            Header: "Nº Factura",
            accessor: "numero",
            Cell: LinkCellTable,
            className: "text-center",
            getProps: () => ({
                linkAccessor: "id_factura",
                path: "facturas",
            }),
        },
        {
            Header: "Lectura",
            accessor: "consumo",
            className: "cubic-metre",
        },
        {
            Header: "Importe",
            accessor: "total",
            className: "dollar font-weight-bold",
        },
        {
            Header: "Estado",
            accessor: "estado",
            className: "text-center",
            Cell: InvoiceStatusCellTable,
        },
        {
            Header: "Meses previos",
            accessor: "resumen",
            className: "text-center",
            Cell: InvoiceResumenCellTable,
        },
    ];

    return {tableColumns};
}
