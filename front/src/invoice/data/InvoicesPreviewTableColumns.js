import {LinkAccessorCellTable} from "base/table/components";
import {InvoiceStatusCellTable} from "invoice/presentational";

export function useInvoicesPreviewTableColumns(
    onClickViewMember,
    invoicesTableType,
    displayAlerts
) {
    const tableColumns = [
        {
            Header: "Socio/a",
            accessor: d => `${d.member_id} - ${d.nombre}`,
            Cell: LinkAccessorCellTable,
            getProps: () => ({
                handleClick: onClickViewMember,
                linkAccessor: "member_id",
            }),
        },
        {
            Header: "Sector",
            accessor: "sector",
            width: 400,
        },
        {
            Header: "Nº factura",
            accessor: "numero",
        },
    ];
    if (invoicesTableType === "measurements") {
        tableColumns.push(
            {
                Header: "Lectura anterior",
                accessor: "caudal_anterior",
                className: "cubic-metre",
            },
            {
                Header: "Lectura actual",
                accessor: "caudal_actual",
                className: "cubic-metre",
            },
            {
                Header: "Consumo",
                accessor: "consumo",
                className: "cubic-metre bold",
            },
            {
                Header: "Cuota fija",
                accessor: "cuota_fija",
                className: "dollar",
            },
            {
                Header: "Cuota variable",
                accessor: "cuota_variable",
                className: "dollar",
            },
            {
                Header: "Saldo pendiente",
                accessor: "saldo_pendiente",
                className: "dollar",
            },
            {
                Header: "Total factura",
                accessor: "total",
                className: "dollar bold",
            }
        );
    }
    if (invoicesTableType === "payments") {
        tableColumns.push(
            {
                Header: "Consumo",
                accessor: "consumo",
                className: "cubic-metre bold",
            },
            {
                Header: "Pago en plazo",
                accessor: "ontime_payment",
                className: "dollar",
            },
            {
                Header: "Pago con mora",
                accessor: "late_payment",
                className: "dollar",
            },
            {
                Header: "Total factura",
                accessor: "total",
                className: "dollar bold",
            },
            {
                Header: "Estado",
                accessor: "estado",
                Cell: InvoiceStatusCellTable,
            }
        );
    }
    displayAlerts &&
        tableColumns.push({
            Header: "Alertas",
            accessor: "errors",
            className: "text-danger small",
        });
    return {tableColumns};
}
