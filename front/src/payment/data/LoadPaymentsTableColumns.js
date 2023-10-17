import {
    EditableDateCellTable,
    EditableTextCellTable,
    LinkAccessorCellTable,
} from "base/table/components";

export function useLoadPaymentsTableColumns(onClickViewMember) {
    const tableColumns = [
        {
            Header: "Socio",
            accessor: d => `${d.member_id} - ${d.member_name}`,
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
            Header: "Nº Factura",
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
