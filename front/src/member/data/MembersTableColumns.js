import {ValueWithIcon} from "base/common";
import {MEMBER_TYPES_MAPPING, USE_TYPES_MAPPING} from ".";
import {LinkCellTable} from "base/table/components";

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
            width: 10,
        },
        {
            label: "Medidor",
            id: "medidor",
            width: 5,
        },
        {
            label: "Tipo de socio/a",
            id: "status",
            formatFunction: item => {
                return (
                    <ValueWithIcon
                        icon={MEMBER_TYPES_MAPPING[item?.status]?.icon}
                        value={MEMBER_TYPES_MAPPING[item?.status]?.label}
                    />
                );
            },
        },
        {
            label: "Tipo de uso",
            id: "tipo_uso",
            formatFunction: item => {
                return (
                    <ValueWithIcon
                        icon={USE_TYPES_MAPPING[item?.tipo_uso]?.icon}
                        value={USE_TYPES_MAPPING[item?.tipo_uso]?.label}
                    />
                );
            },
        },
        {
            label: "Personas acometida",
            id: "personas_acometida",
            width: 5,
        },
        {
            label: "Orden",
            id: "orden",
        },
        {
            label: "Consumo máximo",
            id: "consumo_maximo",
            className: "cubic-metre",
            width: 5,
        },
        {
            label: "Consumo reducción fija",
            id: "consumo_reduccion_fija",
            className: "cubic-metre",
            width: 5,
        },
    ];
    return {tableColumns};
}
