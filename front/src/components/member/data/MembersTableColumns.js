import {LinkCellTable} from "components/common/table";
import MemberStatusCellTable from "../presentation/MemberStatusCellTable";

export function useMembersTableColumns() {
    const tableColumns = [
        {
            Header: "Número",
            accessor: "num_socio",
        },
        {
            Header: "Socio",
            accessor: "name",
            Cell: LinkCellTable,
            getProps: () => ({
                linkAccessor: "num_socio",
            }),
        },
        {
            Header: "Sector",
            accessor: "sector",
        },
        {
            Header: "Medidor",
            accessor: "medidor",
        },
        {
            Header: "Tipo de socio",
            accessor: "tipo_socio",
            Cell: MemberStatusCellTable,
            className: "text-nowrap",
        },
        {
            Header: "Orden",
            accessor: "orden",
        },
        {
            Header: "Consumo máximo",
            accessor: "consumo_maximo",
        },
        {
            Header: "Consumo reducción fija",
            accessor: "consumo_reduccion_fija",
        },
    ];
    return {tableColumns};
}
