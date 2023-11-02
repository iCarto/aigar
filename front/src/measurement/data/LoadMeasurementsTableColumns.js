import {
    EditableSelectCellTable,
    EditableTextCellTable,
    LinkAccessorCellTable,
} from "base/table/components";

export function useLoadMeasurementsTableColumns(onClickViewMember) {
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
            Cell: EditableTextCellTable,
        },
        {
            Header: "Consumo",
            accessor: "consumo",
            className: "cubic-metre bold",
        },
    ];

    return {tableColumns};
}
