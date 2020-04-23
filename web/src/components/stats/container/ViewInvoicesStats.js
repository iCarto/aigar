import React from "react";
import {Spinner} from "components/common";
import {
    InvoicesStatsList,
    InvoicesStatsFieldSelect,
} from "components/stats/presentation";
import ViewInvoicesStatsSidebar from "./ViewInvoicesStatsSidebar";
import {InvoiceService} from "service/api";
import "components/common/SideBar.css";
import {createMemberInvoiceGroups} from "model";
import {BarChart} from "components/common/chart";

class ViewInvoicesStats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoices: null,
            fields: [
                {key: "monto", text: "Monto"},
                {key: "consumo", text: "Consumo"},
                {key: "mora", text: "Mora"},
            ],
            selectedField: "monto",
            filter: {
                startInvoicingMonth: "",
                endInvoicingMonth: "",
                sector: 0,
            },
        };
        this.handleSelectedFieldChange = this.handleSelectedFieldChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        this.loadInvoicesStats();
    }

    loadInvoicesStats() {
        InvoiceService.getInvoicesStats().then(invoices => {
            this.setState({invoices});
        });
    }

    handleSelectedFieldChange(selectedField) {
        this.setState({selectedField});
    }

    handleFilterChange(newFilter) {
        this.setState({
            filter: Object.assign(this.state.filter, newFilter),
        });
    }

    filter(invoices, filter) {
        return invoices.filter(invoice => {
            var filtered = true;
            if (filter) {
                if (filter.startInvoicingMonth) {
                    filtered =
                        filtered &&
                        filter.startInvoicingMonth <= invoice.mes_facturacion;
                }
                if (filter.endInvoicingMonth) {
                    filtered =
                        filtered && filter.endInvoicingMonth >= invoice.mes_facturacion;
                }
                if (filter.sector) {
                    filtered = filtered && invoice.sector === parseInt(filter.sector);
                }
            }
            return filtered;
        });
    }

    getInvoicingMonths(invoices) {
        return invoices.map(invoice => invoice.mes_facturacion);
    }

    convertToMemberInvoiceGroup(invoices) {
        const memberInvoiceGroups = [];
        invoices.forEach(invoice => {
            const indexFound = memberInvoiceGroups.findIndex(
                memberInvoiceGroup => memberInvoiceGroup.num_socio === invoice.num_socio
            );
            if (indexFound >= 0) {
                memberInvoiceGroups[indexFound].invoices.push(invoice);
            } else {
                memberInvoiceGroups.push({
                    num_socio: invoice.num_socio,
                    nombre: invoice.nombre,
                    sector: invoice.sector,
                    invoices: [invoice],
                });
            }
        });
        return createMemberInvoiceGroups(memberInvoiceGroups);
    }

    convertToDataset(invoices) {
        const dataset = [];
        invoices.forEach(invoice => {
            const labelForInvoice =
                invoice.mes_facturacion.substring(4, 6) +
                "/" +
                invoice.mes_facturacion.substring(0, 4);
            const indexFound = dataset.findIndex(
                dataset => dataset.label === labelForInvoice
            );
            if (indexFound >= 0) {
                dataset[indexFound].value =
                    dataset[indexFound].value + invoice[this.state.selectedField];
            } else {
                dataset.push({
                    label: labelForInvoice,
                    value: invoice[this.state.selectedField],
                });
            }
        });
        return dataset;
    }

    getFieldTitle(fieldKey) {
        return this.state.fields.find(field => field.key === fieldKey).text;
    }

    get sidebar() {
        return (
            <ViewInvoicesStatsSidebar
                handleFilterChange={this.handleFilterChange}
                filter={this.state.filter}
            />
        );
    }

    get content() {
        if (this.state.invoices) {
            const filteredInvoices = this.filter(
                this.state.invoices,
                this.state.filter
            );
            return (
                <>
                    <InvoicesStatsFieldSelect
                        fields={this.state.fields}
                        selectedField={this.state.selectedField}
                        handleChange={this.handleSelectedFieldChange}
                    />
                    <InvoicesStatsList
                        invoicingMonths={this.getInvoicingMonths(filteredInvoices)}
                        invoicesStats={this.convertToMemberInvoiceGroup(
                            filteredInvoices
                        )}
                        selectedField={this.state.selectedField}
                        filter={this.state.filter}
                    />
                    <BarChart
                        data={this.convertToDataset(filteredInvoices)}
                        title={this.getFieldTitle(this.state.selectedField)}
                        color="#1c71bc"
                    />
                </>
            );
        }
        return <Spinner message="Cargando datos" />;
    }

    render() {
        return (
            <div className="h-100">
                <div className="row h-100">
                    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                        {this.sidebar}
                    </nav>
                    <div className="col-md-10 offset-md-2">{this.content}</div>
                </div>
            </div>
        );
    }
}

export default ViewInvoicesStats;
