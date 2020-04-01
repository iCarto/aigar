import React from "react";
import {InvoicingMonthService} from "service/api";
import {createInvoice, createInvoicingMonth} from "model";
import {Spinner} from "components/common";
import {InvoicesListPreview} from "../presentation";
import {LoadDataInvoicesTableFilter} from "components/common/loaddata/table";

class LoadMeasurementsStep3InvoicesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoicingMonthToUpdate: null,
            filter: {
                text: "",
            },
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        const invoicesToUpdate = this.props.measurements.map(measurement => {
            const invoice = this.props.invoicingMonth.invoices.find(
                invoice => measurement.num_socio === invoice.num_socio
            );
            return createInvoice(
                Object.assign({}, invoice, {
                    caudal_anterior: measurement.lectura_anterior,
                    caudal_actual: measurement.lectura,
                })
            );
        });
        const invoicingMonthToPreview = createInvoicingMonth(
            Object.assign({}, this.props.invoicingMonth, {
                invoices: invoicesToUpdate,
            })
        );
        InvoicingMonthService.previewInvoicingMonth(invoicingMonthToPreview).then(
            invoicingMonth => {
                this.setState({
                    invoicingMonthToUpdate: invoicingMonth,
                });
                this.props.setIsValidStep(true);
            }
        );
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
        const filteredInvoices = this.state.invoicingMonthToUpdate
            ? this.filter(this.state.invoicingMonthToUpdate.invoices)
            : [];
        return (
            <div className="d-flex flex-column justify-content-around">
                {this.state.invoicingMonthToUpdate ? (
                    <>
                        <LoadDataInvoicesTableFilter
                            filter={this.state.filter}
                            handleChange={this.handleFilterChange}
                        />
                        <InvoicesListPreview invoices={filteredInvoices} />
                    </>
                ) : (
                    <Spinner message="Cargando facturas" />
                )}
            </div>
        );
    }
}

export default LoadMeasurementsStep3InvoicesTable;
