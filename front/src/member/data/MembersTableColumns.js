import {MEMBER_TYPES_MAPPING, USE_TYPES_MAPPING} from "member/config";
import {ValueWithIcon} from "base/ui/other/components";
import {TextLink} from "base/navigation/components";

export function useMembersTableColumns() {
    const tableColumns = [
        {
            label: "N.º",
            id: "id",
        },
        {
            label: "Socio/a",
            id: "name",
            formatFunction: item => {
                return <TextLink text={item.name} to={`/socios/${item.id}`} />;
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
            label: "Reducción fija de consumo",
            id: "consumo_reduccion_fija",
            className: "cubic-metre",
            width: 5,
        },
    ];
    return {tableColumns};
}
