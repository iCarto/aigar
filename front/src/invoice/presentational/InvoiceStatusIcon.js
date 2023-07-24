import React from "react";
import "./InvoiceStatus.css";

class InvoiceStatusIcon extends React.Component {
    getStatusName(estado) {
        const result = estado.replace(/_/g, " ");
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    render() {
        return (
            <span
                className={"estado-icon " + this.props.estado}
                title={this.getStatusName(this.props.estado)}
            ></span>
        );
    }
}

export default InvoiceStatusIcon;
