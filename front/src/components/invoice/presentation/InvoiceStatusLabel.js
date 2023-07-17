import React from "react";
import "./InvoiceStatus.css";

class InvoiceStatusLabel extends React.Component {
    getStatusName(estado) {
        const result = estado.replace(/_/g, " ");
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    render() {
        return (
            <span className={"estado-label " + this.props.estado}>
                {" "}
                {this.getStatusName(this.props.estado)}
            </span>
        );
    }
}

export default InvoiceStatusLabel;
