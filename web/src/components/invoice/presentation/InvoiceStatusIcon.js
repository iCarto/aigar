import React from "react";
import "./InvoiceStatus.css";

class InvoiceStatusIcon extends React.Component {
    render() {
        return <span className={"estado-icon " + this.props.estado}></span>;
    }
}

export default InvoiceStatusIcon;
