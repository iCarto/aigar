import React from "react";
import {
    StartInvoicingMonth,
    InvoicePrintButton,
    LoadPaymentsButton,
    LoadMeasurementsButton,
} from "components/common/invoicing";

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
            <StartInvoicingMonth
                invoicingMonth={this.props.actionsMonth}
                hidden={
                    !this.props.isInvoicingMonth() && !this.props.isNextInvoicingMonth()
                }
                disabled={!this.isInvoiceButtonEnabled()}
                handleClickStartInvoicingMonth={
                    this.props.handleClickStartInvoicingMonth
                }
            />
        );
    }

    get loadMeasurementsButton() {
        return (
            <LoadMeasurementsButton
                hidden={!this.props.isInvoicingMonth()}
                disabled={!this.isInvoiceButtonEnabled()}
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
                disabled={!this.isInvoiceButtonEnabled()}
            />
        );
    }

    render() {
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
