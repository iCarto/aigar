import React from "react";
import {
    PrintInvoiceButton,
    LoadPaymentsButton,
    LoadMeasurementsButton,
    StartInvoicingMonthButton,
} from "components/monthlyinvoicing/container/actions";
import moment from "moment";

class ListMonthlyInvoicesActions extends React.Component {
    getOutputFilename() {
        return (
            "recibo_" +
            this.props.yearMonth.year +
            "_" +
            this.props.yearMonth.month +
            "_todos"
        );
    }

    isStartInvoicingEnabled() {
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

    isPreviousInvoicingMonth() {
        const currentInvoicingMonth = moment()
            .year(this.props.invoicingMonth.year)
            .month(this.props.invoicingMonth.month)
            .date(1);
        return (
            currentInvoicingMonth.month() > this.props.yearMonth.month ||
            currentInvoicingMonth.year() > this.props.yearMonth.year
        );
    }

    isCurrentInvoicingMonth() {
        return (
            this.props.invoicingMonth.month === this.props.yearMonth.month &&
            this.props.invoicingMonth.year === this.props.yearMonth.year
        );
    }

    isNextInvoicingMonth() {
        const nextInvoicingMonth = moment()
            .year(this.props.invoicingMonth.year)
            .month(this.props.invoicingMonth.month)
            .date(1)
            .add(1, "month");
        return (
            nextInvoicingMonth.month() === this.props.yearMonth.month &&
            nextInvoicingMonth.year() === this.props.yearMonth.year
        );
    }

    get invoiceButton() {
        return (
            <StartInvoicingMonthButton
                invoicingMonth={this.props.yearMonth}
                disabled={!this.isStartInvoicingEnabled()}
                handleSuccessCreateInvoices={this.props.handleSuccessCreateInvoices}
            />
        );
    }

    get loadMeasurementsButton() {
        return (
            <LoadMeasurementsButton
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
            />
        );
    }

    get loadPaymentsButton() {
        return <LoadPaymentsButton disabled={!this.isLoadPaymentsButtonEnabled()} />;
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
