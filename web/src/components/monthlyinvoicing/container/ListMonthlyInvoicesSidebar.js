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

    getInvoicesNumbersList() {
        if (this.props.membersMonthInfo) {
            return this.props.membersMonthInfo.map(
                memberMonthInfo => memberMonthInfo.num_factura
            );
        }
        return [];
    }

    render() {
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
                    <div className="d-flex flex-column text-center">
                        <div className="mt-1 mb-1">
                            <button
                                type="botton"
                                className="btn btn-secondary"
                                disabled
                            >
                                1. Cargar lecturas
                            </button>
                        </div>
                        <div className="mt-1 mb-1">
                            <button
                                type="botton"
                                className="btn btn-secondary"
                                disabled
                            >
                                2. Facturar mes
                            </button>
                        </div>
                        <div className="mt-1 mb-1">
                            <button
                                type="botton"
                                className="btn btn-secondary"
                                disabled
                            >
                                3. Cargar pagos
                            </button>
                        </div>
                        <div className="mt-4 mb-4">
                            <InvoicePrintButton
                                invoices={this.getInvoicesNumbersList()}
                                buttonTitle="Imprimir facturas"
                                outputFilename={this.getOutputFilename()}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ListMonthlyInvoicesSidebar;
