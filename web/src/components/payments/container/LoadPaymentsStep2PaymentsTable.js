import React from "react";
import {LoadDataValidatorService} from "service/validation";
import {createPayment} from "model";
import {Spinner} from "components/common";
import {LoadPaymentsList} from "../presentation";
import {LoadDataTableFilter} from "components/common/loaddata/table";
import {InvoicingMonthService} from "service/api";

class LoadPaymentsStep2PaymentsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            filter: {
                text: "",
                props: false,
            },
            invoices: null,
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.onUpdatePayment = this.onUpdatePayment.bind(this);
    }

    getPaymentsTotalErrors(payments) {
        return payments.filter(payment => payment.errors.length !== 0).length;
    }

    componentDidMount() {
        this.setState({loading: true, invoices: null});
        InvoicingMonthService.getInvoicingMonthInvoices(
            this.props.id_mes_facturacion
        ).then(invoices => {
            this.setState({invoices, loading: false}, () => {
                this.reviewPayments(this.props.payments);
            });
        });
    }

    findInvoiceForPayment(payment) {
        let invoiceForPayment = this.state.invoices.find(
            invoice => invoice.numero === payment.num_factura
        );
        if (!invoiceForPayment) {
            invoiceForPayment = this.state.invoices.find(
                invoice => invoice.num_socio === payment.num_socio
            );
        }
        return invoiceForPayment;
    }

    reviewPayments(payments) {
        const paymentsWithErrors = payments.map(payment => {
            const invoiceForPayment = this.findInvoiceForPayment(payment);
            let invoiceFieldsForPayment = {};
            if (invoiceForPayment) {
                invoiceFieldsForPayment = {
                    num_socio: invoiceForPayment.num_socio,
                    nombre_socio: invoiceForPayment.nombre,
                    sector: invoiceForPayment.sector,
                    id_factura: invoiceForPayment.id_factura,
                };
            }
            return createPayment({
                ...payment,
                ...invoiceFieldsForPayment,
                errors: LoadDataValidatorService.validatePaymentEntry(
                    payment,
                    invoiceForPayment
                ),
            });
        });
        this.props.handleChangePayments(paymentsWithErrors);
        this.props.setIsValidStep(
            this.getPaymentsTotalErrors(paymentsWithErrors) === 0
        );
    }

    handleFilterChange(newFilter) {
        this.setState({
            filter: Object.assign(this.state.filter, newFilter),
        });
    }

    filterByText(payment, filterText) {
        return (
            payment.nombre_socio.indexOf(filterText) >= 0 ||
            payment.num_socio.toString().indexOf(filterText) >= 0 ||
            payment.num_factura.toString().indexOf(filterText) >= 0 ||
            payment.fecha.toString().indexOf(filterText) >= 0
        );
    }

    filter(payments) {
        return payments.filter(payment => {
            let filtered = true;
            if (this.state.filter.text != null && this.state.filter.text !== "") {
                filtered = this.filterByText(payment, this.state.filter.text);
            }
            if (this.state.filter.showOnlyErrors === "true") {
                filtered = filtered && payment.errors.length !== 0;
            }
            return filtered;
        });
    }

    onUpdatePayment(rowId, columnId, value) {
        const updatedPayments = this.props.payments.map((payment, index) => {
            if (payment.id === rowId) {
                const updatedPayment = createPayment({
                    ...this.props.payments[index],
                    [columnId]: value,
                });
                console.log({updatedPayment});
                return updatedPayment;
            }
            return payment;
        });
        this.reviewPayments(updatedPayments);
    }

    /* VIEW SUBCOMPONENTS */

    get messagesError() {
        const totalRegistersWithErrors = this.getPaymentsTotalErrors(
            this.props.payments
        );
        if (totalRegistersWithErrors !== 0) {
            return (
                <div className="alert alert-danger text-center" role="alert">
                    Existen <strong>{totalRegistersWithErrors}</strong> registros con
                    error de un total de <strong>{this.props.payments.length}</strong>{" "}
                    registros le??dos.
                </div>
            );
        }
        return null;
    }

    render() {
        const paymentsFiltered = this.filter(this.props.payments);
        if (this.state.loading === true) {
            return <Spinner message="Verificando pagos" />;
        }
        if (this.props.payments) {
            return (
                <div className="d-flex flex-column justify-content-around">
                    {this.messagesError}
                    <LoadDataTableFilter
                        filter={this.state.filter}
                        handleChange={this.handleFilterChange}
                    />
                    <LoadPaymentsList
                        payments={paymentsFiltered}
                        handleFilterChange={this.handleFilterChange}
                        onUpdatePayment={this.onUpdatePayment}
                    />
                </div>
            );
        }
        return <Spinner message="Cargando lecturas" />;
    }
}

export default LoadPaymentsStep2PaymentsTable;
