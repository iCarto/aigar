import React from "react";
import {MonthlyInvoicingCalendar, MonthlyInvoicingFilter} from "../presentation";
import InvoicePrintButton from "components/common/invoicing/InvoicePrintButton";
import {DomainService} from "service/api";

class ListMonthlyInvoicesSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            domain: {
                sectors: [],
                memberTypes: [],
                invoiceStatus: [],
            },
        };
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        this.loadDomains();
    }

    loadDomains() {
        console.log("loadDomains");
        Promise.all([
            DomainService.getSectors(),
            DomainService.getMemberTypes(),
            DomainService.getInvoiceStatus(),
        ]).then(results => {
            this.setState({
                domain: {
                    sectors: results[0],
                    memberTypes: results[1],
                    invoiceStatus: results[2],
                },
            });
        });
    }

    handleDateChange(year, month) {
        console.log("handleDateChange", {year}, {month});
        this.props.handleFilterChange({month, year});
    }

    handleFilterChange(name, value) {
        console.log("handleFilterChange", {name}, {value});
        this.props.handleFilterChange({[name]: value});
    }

    getOutputFilename() {
        return (
            "recibo_" +
            this.props.filter.year +
            "_" +
            this.props.filter.month +
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

    render() {
        if (this.props.invoices) {
            return (
                <div className="sidebar-sticky d-flex flex-column">
                    <div className="sidebar-group">
                        <label>Navegación por meses</label>
                        <MonthlyInvoicingCalendar
                            month={this.props.filter.month}
                            year={this.props.filter.year}
                            handleChange={this.handleDateChange}
                        />
                    </div>
                    <div className="sidebar-group">
                        <label>Filtro</label>
                        <MonthlyInvoicingFilter
                            sectorsDomain={this.state.domain.sectors}
                            memberTypesDomain={this.state.domain.memberTypes}
                            invoiceStatusDomain={this.state.domain.invoiceStatus}
                            filter={this.props.filter}
                            handleChange={this.handleFilterChange}
                        />
                    </div>
                    <div className="sidebar-group mt-auto">
                        <label>Acciones</label>
                        <div className="d-flex flex-column">
                            <button
                                type="botton"
                                className="btn btn-secondary mt-2 mb-2"
                                disabled={!this.isInvoiceButtonEnabled()}
                            >
                                1. Iniciar facturación
                            </button>
                            <button
                                type="botton"
                                className="btn btn-secondary mt-2 mb-2"
                                disabled={!this.isLoadMeasurementsButtonEnabled()}
                            >
                                2. Importar lecturas
                            </button>
                            <InvoicePrintButton
                                invoices={this.props.invoices}
                                buttonTitle="3. Imprimir facturas"
                                outputFilename={this.getOutputFilename()}
                                disabled={!this.isPrintInvoiceButtonEnabled()}
                            />
                            <button
                                type="botton"
                                className="btn btn-secondary mt-2 mb-2"
                                disabled={!this.isLoadPaymentsButtonEnabled()}
                            >
                                4. Cargar pagos
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }
}

export default ListMonthlyInvoicesSidebar;
