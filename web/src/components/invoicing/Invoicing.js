import React from "react";
import InvoiceButton from "components/common/invoicing/invoicebutton/InvoiceButton";

class Invoicing extends React.Component {
    getInvoices() {
        return this.props.database["invoices"]
            ? this.props.database["invoices"]["2019"]["09"]
            : [];
    }

    render() {
        return (
            <div>
                <h1>Facturación</h1>
                <InvoiceButton
                    invoices={this.getInvoices()}
                    buttonTitle="Generar facturación mensual"
                />
            </div>
        );
    }
}

export default Invoicing;
