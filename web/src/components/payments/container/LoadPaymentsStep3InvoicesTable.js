import React from "react";
import {InvoicingMonthService} from "service/api";
import {Spinner} from "components/common";
import {
    InvoicesListPreview,
    LoadDataTableFilter,
} from "components/common/loaddata/table";

class LoadPaymentsStep3InvoicesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {
                text: "",
            },
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        InvoicingMonthService.previewInvoicesWithPayments(
            this.props.id_mes_facturacion,
            this.props.payments
        )
            .then(invoices => {
                this.reviewInvoices(this.props.payments, invoices);
                this.props.handleChangeInvoices(invoices);
                this.props.setIsValidStep(true);
            })
            .catch(error => {
                this.props.setIsValidStep(false);
            });
    }

    reviewInvoices(payments, invoices) {
        invoices.forEach(invoice => {
            const paymentsForInvoice = payments.filter(
                payment => invoice.numero === payment.num_factura
            );
            if (paymentsForInvoice.length !== 0) {
                if (paymentsForInvoice.length > 1) {
                    invoice.errors.push("La factura tiene varios pagos");
                    return;
                }
                if (invoice.total > invoice.pago_1_al_11 + invoice.pago_11_al_30) {
                    invoice.errors.push("El pago no cubre el total");
                }
                if (invoice.total < invoice.pago_1_al_11 + invoice.pago_11_al_30) {
                    invoice.errors.push("El pago supera el total");
                }
            }
        });
    }

    handleFilterChange(newFilter) {
        this.setState({
            filter: Object.assign(this.state.filter, newFilter),
        });
    }

    filterByText(invoice, filterText) {
        return (
            invoice.numero.indexOf(filterText) >= 0 ||
            invoice.num_socio.toString().indexOf(filterText) >= 0 ||
            invoice.nombre
                .toString()
                .toLowerCase()
                .indexOf(filterText.toLowerCase()) >= 0
        );
    }

    filter(invoices) {
        return invoices.filter(invoice => {
            let filtered = true;
            if (this.state.filter.text != null && this.state.filter.text !== "") {
                filtered = this.filterByText(invoice, this.state.filter.text);
            }
            if (this.state.filter.showOnlyErrors === "true") {
                filtered = filtered && invoice.errors.length !== 0;
            }
            return filtered;
        });
    }

    get messagesError() {
        const totalInvoicesWithErrors = this.props.invoices.filter(
            invoice => invoice.errors.length !== 0
        ).length;
        if (totalInvoicesWithErrors !== 0) {
            return (
                <div className="alert alert-warning text-center" role="alert">
                    Existen <strong>{totalInvoicesWithErrors}</strong> facturas con
                    alertas que debería revisar.
                </div>
            );
        }
        return null;
    }

    render() {
        const filteredInvoices = this.props.invoices
            ? this.filter(this.props.invoices)
            : [];
        return (
            <div className="d-flex flex-column justify-content-around">
                {this.props.invoices ? (
                    <>
                        {this.messagesError}
                        <LoadDataTableFilter
                            filter={this.state.filter}
                            handleChange={this.handleFilterChange}
                        />
                        <InvoicesListPreview
                            invoices={filteredInvoices}
                            invoicesTableType="payments"
                        />
                    </>
                ) : (
                    <Spinner message="Cargando facturas" />
                )}
            </div>
        );
    }
}

export default LoadPaymentsStep3InvoicesTable;
