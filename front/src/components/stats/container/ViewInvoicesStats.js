import React from "react";
import {Spinner} from "components/common";
import {
    InvoicesStatsList,
    InvoicesStatsFieldSelect,
    InvoicesStatOpenedMonthInfo,
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
                {key: "monto", text: "Monto", unit: "$", unitClass: "dollar"},
                {key: "consumo", text: "Consumo", unit: "㎥", unitClass: "cubic-metre"},
                {key: "mora", text: "Mora", unit: "$", unitClass: "dollar"},
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
        return [...new Set(invoices.map(invoice => invoice.mes_facturacion))];
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

    convertToMoraDataset(invoices) {
        let datasetMoraPorRetrasoData = [];
        let datasetMoraPorImpagoData = [];
        invoices.forEach(invoice => {
            const labelForInvoice = invoice.mes_facturacion;
            const indexFound = datasetMoraPorRetrasoData.findIndex(
                dataset => dataset.label === labelForInvoice
            );
            if (indexFound >= 0) {
                datasetMoraPorRetrasoData[indexFound].value =
                    datasetMoraPorRetrasoData[indexFound].value +
                    invoice["mora_por_retraso"];
                datasetMoraPorImpagoData[indexFound].value =
                    datasetMoraPorImpagoData[indexFound].value +
                    invoice["mora_por_impago"];
            } else {
                datasetMoraPorRetrasoData.push({
                    label: labelForInvoice,
                    value: invoice["mora_por_retraso"],
                });
                datasetMoraPorImpagoData.push({
                    label: labelForInvoice,
                    value: invoice["mora_por_impago"],
                });
            }
        });
        return [
            {
                label: "Mora por retraso ($)",
                data: datasetMoraPorRetrasoData,
                backgroundColor: "#7aafdd",
            },
            {
                label: "Mora por impago ($)",
                data: datasetMoraPorImpagoData,
                backgroundColor: "#1c71bc",
            },
        ];
    }

    convertToDataset(invoices) {
        if (this.state.selectedField === "mora") {
            return this.convertToMoraDataset(invoices);
        }
        const datasetData = [];
        invoices.forEach(invoice => {
            const labelForInvoice = invoice.mes_facturacion;
            const indexFound = datasetData.findIndex(
                dataset => dataset.label === labelForInvoice
            );
            if (indexFound >= 0) {
                datasetData[indexFound].value =
                    datasetData[indexFound].value + invoice[this.state.selectedField];
            } else {
                datasetData.push({
                    label: labelForInvoice,
                    value: invoice[this.state.selectedField],
                });
            }
        });
        return [
            {
                label: this.getLabelFromSelectedField(),
                data: datasetData,
                backgroundColor: "#1c71bc",
            },
        ];
    }

    getLabelFromSelectedField() {
        return (
            this.getFieldTitle(this.state.selectedField) +
            " (" +
            this.getFieldUnit(this.state.selectedField) +
            ")"
        );
    }

    getFieldTitle(fieldKey) {
        return this.state.fields.find(field => field.key === fieldKey).text;
    }

    getFieldUnit(fieldKey) {
        return this.state.fields.find(field => field.key === fieldKey).unit;
    }

    getFieldUnitClass(fieldKey) {
        return this.state.fields.find(field => field.key === fieldKey).unitClass;
    }

    get sidebar() {
        return (
            <ViewInvoicesStatsSidebar
                handleFilterChange={this.handleFilterChange}
                filter={this.state.filter}
            />
        );
    }

    formatInvoicingMonth(invoicingMonth) {
        return invoicingMonth.substring(4, 6) + "/" + invoicingMonth.substring(0, 4);
    }

    get statsInfo() {
        if (this.state.selectedField === "monto" && this.state.invoices) {
            return <InvoicesStatOpenedMonthInfo invoices={this.state.invoices} />;
        }
        return null;
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
                        invoicesStatsLength={this.state.invoices.length}
                        selectedField={this.state.selectedField}
                        unitClass={this.getFieldUnitClass(this.state.selectedField)}
                        filter={this.state.filter}
                    />
                    {this.statsInfo}
                    <BarChart
                        dataLabels={this.getInvoicingMonths(filteredInvoices)}
                        dataLabelsFormat={this.formatInvoicingMonth}
                        dataDatasets={this.convertToDataset(filteredInvoices)}
                    />
                </>
            );
        }
        return <Spinner message="Cargando datos" />;
    }

    render() {
        return (
            <>
                <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                    {this.sidebar}
                </nav>
                <div className="col-md-10 offset-md-2">
                    <div className="container">{this.content}</div>
                </div>
            </>
        );
    }
}

export default ViewInvoicesStats;
