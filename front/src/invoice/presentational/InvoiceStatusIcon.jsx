import "./InvoiceStatus.css";

const InvoiceStatusIcon = ({estado}) => {
    const getStatusName = estado => {
        const result = estado.replace(/_/g, " ");
        return result.charAt(0).toUpperCase() + result.slice(1);
    };

    return (
        <span className={"estado-icon " + estado} title={getStatusName(estado)}></span>
    );
};

export default InvoiceStatusIcon;
