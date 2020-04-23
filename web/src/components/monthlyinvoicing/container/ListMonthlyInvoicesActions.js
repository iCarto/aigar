import React from "react";
import {
    PrintInvoiceButton,
    LoadPaymentsButton,
    LoadMeasurementsButton,
    StartInvoicingMonthButton,
    ExportMemberButton,
} from "components/monthlyinvoicing/container/actions";
import {ESTADOS_FACTURA} from "model";

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

    isExportMembersButtonEnabled() {
        return true;
    }

    isLoadPaymentsButtonEnabled() {
        return (
            this.props.invoices.length > 0 &&
            this.props.invoices.filter(
                invoice => invoice.estado === ESTADOS_FACTURA.PENDIENTE_DE_COBRO
            ).length !== 0
        );
    }

    get invoiceButton() {
        return (
            <StartInvoicingMonthButton
                position="1"
                invoicingMonth={this.props.selectedInvoicingMonth}
                disabled={!this.isStartInvoicingEnabled()}
                handleSuccessCreateInvoices={this.props.handleSuccessCreateInvoices}
            />
        );
    }

    get loadMeasurementsButton() {
        return (
            <LoadMeasurementsButton
                position="2"
                invoicingMonth={this.props.selectedInvoicingMonth}
                disabled={!this.isLoadMeasurementsButtonEnabled()}
            />
        );
    }

    get printInvoiceButton() {
        return (
            <PrintInvoiceButton
                invoices={this.props.invoices}
                position="3"
                buttonTitle="Imprimir facturas"
                outputFilename={this.getOutputFilename()}
                disabled={!this.isPrintInvoiceButtonEnabled()}
                handleSuccessPrintedInvoices={this.props.handleSuccessPrintedInvoices}
            />
        );
    }

    get exportMemberButton() {
        return (
            <ExportMemberButton
                position="4"
                disabled={!this.isExportMembersButtonEnabled()}
            />
        );
    }

    get loadPaymentsButton() {
        return (
            <LoadPaymentsButton
                position="5"
                invoicingMonth={this.props.selectedInvoicingMonth}
                disabled={!this.isLoadPaymentsButtonEnabled()}
            />
        );
    }

    render() {
        if (this.props.invoices) {
            if (this.isNextInvoicingMonth() || this.isCurrentInvoicingMonth()) {
                return (
                    <div className="d-flex flex-column pl-4 pr-4">
                        {this.invoiceButton}
                        {this.loadMeasurementsButton}
                        {this.printInvoiceButton}
                        {this.exportMemberButton}
                        {this.loadPaymentsButton}
                    </div>
                );
            }
            return null;
        }
        return null;
    }
}

export default ListMonthlyInvoicesActions;
