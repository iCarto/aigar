import React from "react";

const MemberStatusCellTable = ({row, column, cell}) => {
    const showOnlyIcons = column.getProps && column.getProps().showOnlyIcons === true;
    if (cell.value === "eliminado")
        return (
            <span className="text-secondary">
                <i className="fas fa-times mr-1" title="Eliminado" />{" "}
                {showOnlyIcons ? null : "Eliminado"}
            </span>
        );
    if (cell.value === "solo_mecha")
        return (
            <span>
                <i className="fas fa-tint-slash mr-1" title="Solo mecha" />{" "}
                {showOnlyIcons ? null : "Solo mecha"}
            </span>
        );
    if (cell.value === "con_ajuste_consumo")
        return (
            <span>
                <i className="fas fa-adjust mr-1" title="Con ajuste de consumo" />{" "}
                {showOnlyIcons ? null : "Con ajuste"}
            </span>
        );
    return (
        <span>
            <i className="fas fa-tint mr-1" title="Conectado" />{" "}
            {showOnlyIcons ? null : "Conectado"}
        </span>
    );
};

export default MemberStatusCellTable;
