import {LinkCellTable} from "base/table";
import {InvoiceStatusCellTable} from "../presentational";
import InvoiceGroupFieldsCellTable from "../presentational/InvoiceGroupFieldsCellTable";
import InvoiceMonthCellTable from "../presentational/InvoiceMonthCellTable";

export function useInvoicesTableColumns() {
    const tableColumns = [
        {
            Header: "Socio",
            accessor: "nombre",
            className: "font-weight-bold text-nowrap",
        },
        {
            Header: "Sector",
            accessor: "sector",
        },
        {
            Header: "Número",
            accessor: "numero",
            Cell: LinkCellTable,
            getProps: () => ({
                linkAccessor: "id_factura",
            }),
        },
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
