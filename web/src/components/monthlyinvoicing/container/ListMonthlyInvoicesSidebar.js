import React from "react";
import {MonthlyInvoicingCalendar, MonthlyInvoicingFilter} from "../presentation";
import {DomainService} from "service/api";
import ListMonthlyInvoicesActions from "./ListMonthlyInvoicesActions";
import moment from "moment";

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
        this.isInvoicingMonth = this.isInvoicingMonth.bind(this);
        this.isNextInvoicingMonth = this.isNextInvoicingMonth.bind(this);
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

    isInvoicingMonth() {
        return (
            this.props.invoicingMonth.month === this.props.filter.month &&
            this.props.invoicingMonth.year === this.props.filter.year
        );
    }

    isNextInvoicingMonth() {
        const nextInvoicingMonth = moment()
            .year(this.props.invoicingMonth.year)
            .month(this.props.invoicingMonth.month)
            .date(1)
            .add(1, "month");
        return (
            nextInvoicingMonth.month() === this.props.filter.month &&
            nextInvoicingMonth.year() === this.props.filter.year
        );
    }

    get actionsMonth() {
        return {
            month: this.props.filter.month,
            year: this.props.filter.year,
        };
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
                            isNextInvoicingMonth={this.isNextInvoicingMonth}
                        />
                    </div>
                    <div className="sidebar-group">
                        <label>Acciones</label>
                        <div className="d-flex flex-column">
                            <ListMonthlyInvoicesActions
                                isInvoicingMonth={this.isInvoicingMonth}
                                isNextInvoicingMonth={this.isNextInvoicingMonth}
                                actionsMonth={this.actionsMonth}
                                invoices={this.props.invoices}
                                handleClickStartInvoicingMonth={
                                    this.props.handleClickStartInvoicingMonth
                                }
                            />
                        </div>
                    </div>
                    <div className="sidebar-group mt-auto mb-5">
                        <label>Filtro</label>
                        <MonthlyInvoicingFilter
                            sectorsDomain={this.state.domain.sectors}
                            memberTypesDomain={this.state.domain.memberTypes}
                            invoiceStatusDomain={this.state.domain.invoiceStatus}
                            filter={this.props.filter}
                            handleChange={this.handleFilterChange}
                        />
                    </div>
                </div>
            );
        }
        return null;
    }
}

export default ListMonthlyInvoicesSidebar;
