import {
    EditableDateCellTable,
    EditableTextCellTable,
    LinkAccessorCellTable,
} from "base/table/components";

import {PreviewInvoiceAlertCellTable} from "payment/presentational/PreviewInvoiceAlertCellTable";
import {RemoveRowCellTable} from "payment/presentational/RemoveRowCellTable";

export function useLoadPaymentsTableColumns(
    onClickViewMember,
    displayAlerts,
    removeRow
) {
    const tableColumns = [
        {
            Header: "Socio/a",
            accessor: invoice => {
                return `${invoice.member_id} - ${invoice.member_name}`;
            },
            Cell: LinkAccessorCellTable,
            getProps: () => ({
                handleClick: onClickViewMember,
                linkAccessor: "member_id",
            }),
        },
        {
            Header: "Sector",
            accessor: "sector",
        },
        {
            Header: "Nº Recibo",
            accessor: "num_factura",
            Cell: EditableTextCellTable,
        },
        {
            Header: "Fecha",
            accessor: "fecha",
            Cell: EditableDateCellTable,
        },
        {
            Header: "Monto",
            accessor: "monto",
            className: "dollar",
            style: {textAlign: "right"},
        },
    ];

    displayAlerts &&
        tableColumns.push({
            Header: "Alertas",
            accessor: "errors",
            Cell: PreviewInvoiceAlertCellTable,
        });

    if (displayAlerts)
        tableColumns.push({
            Header: "Acciones",
            accessor: "actions",
            className: "text-danger small",
            width: 100,
            Cell: RemoveRowCellTable,
            getProps: () => ({
                handleClick: removeRow,
            }),
        });

    return {tableColumns};
}
