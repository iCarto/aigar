const MemberStatusCellTable = ({status, showOnlyIcons = false}) => {
    if (status === "eliminado")
        return (
            <span className="text-secondary">
                <i className="fas fa-times mr-1" title="Eliminado" />{" "}
                {showOnlyIcons ? null : "Eliminado"}
            </span>
        );
    if (status === "solo_mecha")
        return (
            <span>
                <i className="fas fa-tint-slash mr-1" title="Solo mecha" />{" "}
                {showOnlyIcons ? null : "Solo mecha"}
            </span>
        );
    if (status === "con_ajuste_consumo")
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
