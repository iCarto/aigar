import {
    EditableDateCellTable,
    EditableTextCellTable,
    LinkAccessorCellTable,
} from "base/table/components";

export function useLoadPaymentsTableColumns(onClickViewMember) {
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

    return {tableColumns};
}
