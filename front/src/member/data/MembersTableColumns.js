import {LinkCellTable} from "base/table/components";
import {MemberStatusCellTable} from "member/presentational";

export function useMembersTableColumns() {
    const tableColumns = [
        {
            label: "N.º",
            id: "num_socio",
        },
        {
            label: "Socio",
            id: "name",
            formatFunction: item => {
                return (
                    <LinkCellTable text={item.name} to={`/socios/${item.num_socio}`} />
                );
            },
        },
        {
            label: "Sector",
            id: "sector",
        },
        {
            label: "Medidor",
            id: "medidor",
        },
        {
            label: "Tipo de socio",
            id: "tipo_socio",
            formatFunction: item => {
                return <MemberStatusCellTable status={item.tipo_socio} />;
            },
        },
        {
            label: "Orden",
            id: "orden",
        },
        {
            label: "Consumo máximo",
            id: "consumo_maximo",
            className: "cubic-metre",
        },
        {
            label: "Consumo reducción fija",
            id: "consumo_reduccion_fija",
            className: "cubic-metre",
        },
    ];
    return {tableColumns};
}
