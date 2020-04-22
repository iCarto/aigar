import React from "react";
import {InvoicingMonthService} from "service/api";
import {Spinner} from "components/common";
import {
    InvoicesListPreview,
    LoadDataTableFilter,
} from "components/common/loaddata/table";

class LoadMeasurementsStep3InvoicesTable extends React.Component {
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
        InvoicingMonthService.previewInvoicesWithMeasurements(
            this.props.id_mes_facturacion,
            this.props.measurements
        )
            .then(invoices => {
                this.reviewMeasurements(this.props.measurements, invoices);
                this.props.handleChangeInvoices(invoices);
                this.props.setIsValidStep(true);
            })
            .catch(error => {
                this.props.setIsValidStep(false);
            });
    }

    reviewMeasurements(measurements, invoices) {
        measurements.forEach(measurement => {
            const invoice = invoices.find(
                invoice => invoice.num_socio === measurement.num_socio
            );
            if (invoice.caudal_anterior !== measurement.caudal_anterior) {
                invoice.errors.push(
                    "No coincide la lectura anterior (" +
                        measurement.caudal_anterior +
                        ", " +
                        invoice.caudal_anterior +
                        ")"
                );
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
                            invoicesTableType="measurements"
                        />
                    </>
                ) : (
                    <Spinner message="Cargando facturas" />
                )}
            </div>
        );
    }
}

export default LoadMeasurementsStep3InvoicesTable;
