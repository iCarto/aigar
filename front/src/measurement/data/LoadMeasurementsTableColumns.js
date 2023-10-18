import {
    EditableSelectCellTable,
    EditableTextCellTable,
    LinkAccessorCellTable,
} from "base/table/components";

export function useLoadMeasurementsTableColumns(onClickViewMember) {
    const tableColumns = [
        {
            Header: "Socio",
            accessor: d => `${d.id} - ${d.nombre}`,
            Cell: LinkAccessorCellTable,
            getProps: () => ({
                handleClick: onClickViewMember,
                linkAccessor: "id",
            }),
        },
        {
            Header: "Sector",
            accessor: "sector",
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
