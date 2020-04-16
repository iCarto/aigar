import React from "react";
import {
    PrintInvoiceButton,
    LoadPaymentsButton,
    LoadMeasurementsButton,
    StartInvoicingMonthButton,
} from "components/monthlyinvoicing/container/actions";

class ListMonthlyInvoicesActions extends React.Component {
    getOutputFilename() {
        return (
            "recibo_" +
            this.props.selectedInvoicingMonth.anho +
            "_" +
            this.props.selectedInvoicingMonth.mes +
            "_todos"
        );
    }

    isPreviousInvoicingMonth() {
        return !this.props.selectedInvoicingMonth.is_open;
    }

    isCurrentInvoicingMonth() {
        return this.props.selectedInvoicingMonth.is_open;
    }

    isNextInvoicingMonth() {
        return this.props.selectedInvoicingMonth.id_mes_facturacion < 0;
    }

    isStartInvoicingEnabled() {
        return this.isNextInvoicingMonth();
    }

    isLoadMeasurementsButtonEnabled() {
        return (
            this.props.invoices.length > 0 &&
            this.props.invoices.filter(invoice => invoice.consumo === "").length !== 0
        );
    }

    isPrintInvoiceButtonEnabled() {
        return (
            this.props.invoices.length > 0 &&
            this.props.invoices.filter(invoice => invoice.consumo === "").length === 0
        );
    }

    isLoadPaymentsButtonEnabled() {
        return true;
        /*return (
            this.props.invoices.length > 0 &&
            this.props.invoices.filter(
                invoice =>
                    invoice.estado === "emitida" ||
                    invoice.estado === "pendiente_de_cobro"
            ).length !== 0
        );*/
    }

    get invoiceButton() {
        return (
            <StartInvoicingMonthButton
                invoicingMonth={this.props.selectedInvoicingMonth}
                disabled={!this.isStartInvoicingEnabled()}
                handleSuccessCreateInvoices={this.props.handleSuccessCreateInvoices}
            />
        );
    }

    get loadMeasurementsButton() {
        return (
            <LoadMeasurementsButton
                invoicingMonth={this.props.selectedInvoicingMonth}
                disabled={!this.isLoadMeasurementsButtonEnabled()}
            />
        );
    }

    get printInvoiceButton() {
        return (
            <PrintInvoiceButton
                invoices={this.props.invoices}
                buttonTitle="3. Imprimir facturas"
                outputFilename={this.getOutputFilename()}
                disabled={!this.isPrintInvoiceButtonEnabled()}
                handleSuccessPrintedInvoices={this.props.handleSuccessPrintedInvoices}
            />
        );
    }

    get loadPaymentsButton() {
        return (
            <LoadPaymentsButton
                invoicingMonth={this.props.selectedInvoicingMonth}
                disabled={!this.isLoadPaymentsButtonEnabled()}
            />
        );
    }

    render() {
        if (this.props.invoices) {
            if (this.isNextInvoicingMonth()) {
                return this.invoiceButton;
            }
            if (this.isCurrentInvoicingMonth()) {
                return (
                    <>
                        {this.invoiceButton}
                        {this.loadMeasurementsButton}
                        {this.printInvoiceButton}
                        {this.loadPaymentsButton}
                    </>
                );
            }
            if (this.isPreviousInvoicingMonth()) {
                return this.printInvoiceButton;
            }
            return null;
        }
        return null;
    }
}

export default ListMonthlyInvoicesActions;
