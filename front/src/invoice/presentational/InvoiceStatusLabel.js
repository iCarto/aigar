import "./InvoiceStatus.css";

const InvoiceStatusLabel = ({estado}) => {
    const getStatusName = estado => {
        const result = estado.replace(/_/g, " ");
        return result.charAt(0).toUpperCase() + result.slice(1);
    };

    return estado ? (
        <span className={"estado-label " + estado}> {getStatusName(estado)}</span>
    ) : null;
};

export default InvoiceStatusLabel;
