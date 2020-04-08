import React from "react";
import {InvoicingMonthService} from "service/api";
import {Spinner} from "components/common";
import {
    LoadDataInvoicesTableFilter,
    InvoicesListPreview,
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
                this.props.handleChangeInvoices(invoices);
                this.props.setIsValidStep(true);
            })
            .catch(error => {
                this.props.setIsValidStep(false);
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
            invoice.nombre.toString().indexOf(filterText) >= 0
        );
    }

    filter(invoices) {
        return invoices.filter(invoice => {
            let filtered = true;
            if (this.state.filter.text != null && this.state.filter.text !== "") {
                filtered = this.filterByText(invoice, this.state.filter.text);
            }
            return filtered;
        });
    }

    render() {
        const filteredInvoices = this.props.invoices
            ? this.filter(this.props.invoices)
            : [];
        return (
            <div className="d-flex flex-column justify-content-around">
                {this.props.invoices ? (
                    <>
                        <LoadDataInvoicesTableFilter
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
