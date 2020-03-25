import React from "react";
import {
    InvoicePrintButton,
    LoadPaymentsButton,
    LoadMeasurementsButton,
} from "components/common/invoicing";
import StartInvoicingMonthButton from "./StartInvoicingMonthButton";

class ListMonthlyInvoicesActions extends React.Component {
    getOutputFilename() {
        return (
            "recibo_" +
            this.props.actionsMonth.year +
            "_" +
            this.props.actionsMonth.month +
            "_todos"
        );
    }

    isInvoiceButtonEnabled() {
        return this.props.invoices.length === 0;
    }

    isLoadMeasurementsButtonEnabled() {
        return (
            this.props.invoices.length > 0 &&
            this.props.invoices.filter(invoice => invoice.consumo == null).length !== 0
        );
    }

    isPrintInvoiceButtonEnabled() {
        return (
            this.props.invoices.length > 0 &&
            this.props.invoices.filter(invoice => invoice.consumo == null).length === 0
        );
    }

    isLoadPaymentsButtonEnabled() {
        return (
            this.props.invoices.length > 0 &&
            this.props.invoices.filter(
                invoice =>
                    invoice.estado === "emitida" ||
                    invoice.estado === "pendiente_de_cobro"
            ).length !== 0
        );
    }

    get invoiceButton() {
        return (
            <StartInvoicingMonthButton
                invoicingMonth={this.props.actionsMonth}
                hidden={
                    !this.props.isInvoicingMonth() && !this.props.isNextInvoicingMonth()
                }
                disabled={!this.isInvoiceButtonEnabled()}
                handleSuccessCreateInvoices={this.props.handleSuccessCreateInvoices}
            />
        );
    }

    get loadMeasurementsButton() {
        return (
            <LoadMeasurementsButton
                hidden={!this.props.isInvoicingMonth()}
                disabled={!this.isLoadMeasurementsButtonEnabled()}
            />
        );
    }

    get printInvoiceButton() {
        return (
            <InvoicePrintButton
                invoices={this.props.invoices}
                buttonTitle={
                    this.props.isInvoicingMonth() ? "3. Imprimir facturas" : "Imprimir"
                }
                outputFilename={this.getOutputFilename()}
                hidden={this.props.isNextInvoicingMonth()}
                disabled={!this.isPrintInvoiceButtonEnabled()}
            />
        );
    }

    get loadPaymentsButton() {
        return (
            <LoadPaymentsButton
                hidden={!this.props.isInvoicingMonth()}
                disabled={!this.isLoadPaymentsButtonEnabled()}
            />
        );
    }

    render() {
        console.log("ListMonthlyInvoicesActions.render", this.props);
        return (
            <>
                {this.invoiceButton}
                {this.loadMeasurementsButton}
                {this.printInvoiceButton}
                {this.loadPaymentsButton}
            </>
        );
    }
}

export default ListMonthlyInvoicesActions;
