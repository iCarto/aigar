import {InvoiceStatusCellTable} from "invoice/presentational";
import InvoiceGroupFieldsCellTable from "invoice/presentational/InvoiceGroupFieldsCellTable";
import InvoiceMonthCellTable from "invoice/presentational/InvoiceMonthCellTable";

export function useMemberInvoicesTableColumns() {
    const tableColumns = [
        {
            Header: "Mes",
            accessor: "mes_facturacion",
            Cell: InvoiceMonthCellTable,
        },
        {
            Header: "Caudal anterior",
            accessor: "caudal_anterior",
            className: "cubic-metre",
        },
        {
            Header: "Caudal actual",
            accessor: "caudal_actual",
            className: "cubic-metre",
        },
        {
            Header: "Consumo",
            accessor: "consumo",
            className: "cubic-metre",
        },
        {
            Header: "Mora",
            accessor: "mora",
            className: "dollar",
        },
        {
            Header: "Otros",
            Cell: InvoiceGroupFieldsCellTable,
        },
        {
            Header: "Total",
            accessor: "total",
            className: "dollar font-weight-bold",
        },
        {
            Header: "Estado",
            accessor: "estado",
            Cell: InvoiceStatusCellTable,
        },
    ];
    return {tableColumns};
}
