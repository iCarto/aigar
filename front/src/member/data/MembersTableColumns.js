import {USE_TYPES_MAPPING} from ".";
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
            label: "Nº personas acometida",
            id: "personas_acometida",
        },
        {
            label: "Tipo de uso",
            id: "tipo_uso",
            formatFunction: item => {
                return USE_TYPES_MAPPING[item?.tipo_uso]?.label;
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
