import {LinkCellTable} from "components/common/table";

import {
    InvoiceResumenCellTable,
    InvoiceStatusCellTable,
} from "components/invoice/presentation";
import {MemberStatusCellTable} from "components/member/presentation";

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
                // handleClick: handleClickViewMember,
                linkAccessor: "num_socio",
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
                // handleClick: handleClickViewInvoice,
                linkAccessor: "id_factura",
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
