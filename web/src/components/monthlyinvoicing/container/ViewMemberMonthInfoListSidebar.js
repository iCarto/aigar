import React from "react";
import {MonthlyInvoicingCalendar, MonthlyInvoicingFilter} from "../presentation";
import InvoicePrintButton from "components/common/invoicing/InvoicePrintButton";
import moment from "moment";
import {DomainService} from "service/api";

class ViewMemberMonthInfoListSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {
                month: moment().month(),
                year: moment().year(),
            },
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

    getOutputFilename() {
        return (
            "recibo_" +
            this.state.filter.year +
            "_" +
            this.state.filter.month +
            "_todos"
        );
    }

    handleDateChange(year, month) {
        console.log("handleDateChange", {year}, {month});
        this.setState(
            {
                filter: {
                    ...this.state.filter,
                    month,
                    year,
                },
            },
            () => {
                this.props.handleFilterChange(this.state.filter);
            }
        );
    }

    handleFilterChange(name, value) {
        console.log("handleFilterChange", {name}, {value});
        this.setState(
            {
                filter: {
                    ...this.state.filter,
                    [name]: value,
                },
            },
            () => {
                this.props.handleFilterChange(this.state.filter);
            }
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
            <div className="sidebar-sticky p-3 d-flex flex-column">
                <MonthlyInvoicingCalendar
                    month={this.state.filter.month}
                    year={this.state.filter.year}
                    handleChange={this.handleDateChange}
                />
                <MonthlyInvoicingFilter
                    sectorsDomain={this.state.domain.sectors}
                    memberTypesDomain={this.state.domain.memberTypes}
                    invoiceStatusDomain={this.state.domain.invoiceStatus}
                    handleChange={this.handleFilterChange}
                />
                <InvoicePrintButton
                    invoices={this.getInvoicesNumbersList()}
                    buttonTitle="Imprimir facturas"
                    outputFilename={this.getOutputFilename()}
                />
            </div>
        );
    }
}

export default ViewMemberMonthInfoListSidebar;
