import React from "react";
import InvoiceButton from "components/common/invoicing/invoicebutton/InvoiceButton";

class Invoicing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoiceYear: "2019",
            invoiceMonth: "09",
        };
    }

    getInvoices() {
        return this.props.database["invoices"]
            ? this.props.database["invoices"][this.state.invoiceYear][
                  this.state.invoiceMonth
              ]
            : [];
    }

    getOutputFilename() {
        return (
            "recibo_" +
            this.state.invoiceYear +
            "_" +
            this.state.invoiceMonth +
            "_todos"
        );
    }

    render() {
        return (
            <div>
                <h1>Facturación</h1>
                <InvoiceButton
                    invoices={this.getInvoices()}
                    buttonTitle="Generar facturación mensual"
                    outputFilename={this.getOutputFilename()}
                />
            </div>
        );
    }
}

export default Invoicing;
