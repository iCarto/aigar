import {
    EditableIntegerCellTable,
    EditableSelectCellTable,
    EditableTextCellTable,
    LinkAccessorCellTable,
} from "base/table/components";

import {PreviewInvoiceAlertCellTable} from "payment/presentational/PreviewInvoiceAlertCellTable";
import {RemoveRowCellTable} from "payment/presentational/RemoveRowCellTable";

export function useLoadMeasurementsTableColumns(
    onClickViewMember,
    invoicesTableType,
    displayAlerts,
    removeRow = null
) {
    const tableColumns = [
        {
            Header: "Socio/a",
            accessor: d => `${d.member_id} - ${d.member_name}`,
            Cell: LinkAccessorCellTable,
            getProps: () => ({
                handleClick: onClickViewMember,
                linkAccessor: "id",
            }),
        },
        {
            Header: "Sector",
            accessor: "sector",
            width: 240,
        },
        {
            Header: "Medidor",
            accessor: "medidor",
            Cell: EditableTextCellTable,
        },
        {
            Header: "Cambio medidor",
            accessor: "cambio_medidor",
            Cell: EditableSelectCellTable,
        },
        {
            Header: "Lectura anterior",
            accessor: "caudal_anterior",
            className: "cubic-metre",
        },
        {
            Header: "Lectura actual",
            accessor: "caudal_actual",
            Cell: EditableIntegerCellTable,
        },
        {
            Header: "Consumo",
            accessor: "consumo",
            className: "cubic-metre bold",
        },
    ];
    displayAlerts &&
        tableColumns.push({
            Header: "Alertas",
            accessor: "errors",
            Cell: PreviewInvoiceAlertCellTable,
        });
    displayAlerts &&
        tableColumns.push({
            Header: "Acciones",
            accessor: "actions",
            className: "text-danger small",
            width: 100,
            Cell: RemoveRowCellTable,
            getProps: () => ({
                handleClick: removeRow,
                linkAccessor: null,
            }),
        });

    return {tableColumns};
}
