import "./InvoiceStatus.css";

const ESTADOS_FACTURA_LABEL = {
    nueva: "Nuevo",
    pendiente_de_cobro: "Pendiente de cobro",
    cobrada: "Cobrado",
    no_cobrada: "No cobrado",
    anulada: "Anulado",
};

const InvoiceStatusLabel = ({estado}) => {
    const getStatusName = estado => {
        return ESTADOS_FACTURA_LABEL[estado];
    };

    return estado ? (
        <span className={"estado-label " + estado}> {getStatusName(estado)}</span>
    ) : null;
};

export default InvoiceStatusLabel;
