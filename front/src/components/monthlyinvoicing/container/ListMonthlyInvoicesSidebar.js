import React from "react";
import {MonthlyInvoicingNavigator} from "../presentation";
import ListMonthlyInvoicesActions from "./ListMonthlyInvoicesActions";
import ListMonthlyInvoicesFilter from "./ListMonthlyInvoicesFilter";

class ListMonthlyInvoicesSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    handleDateChange(year, month) {
        this.props.handleFilterChange({month, year});
    }

    render() {
        return (
            <div className="sidebar-sticky d-flex flex-column">
                <MonthlyInvoicingNavigator
                    selectedInvoicingMonth={this.props.selectedInvoicingMonth}
                    invoicingMonths={this.props.invoicingMonths}
                    handleChangeInvoicingMonth={this.props.handleChangeInvoicingMonth}
                />
                <ListMonthlyInvoicesActions
                    selectedInvoicingMonth={this.props.selectedInvoicingMonth}
                    invoices={this.props.invoices}
                    handleSuccessCreateInvoices={this.props.handleSuccessCreateInvoices}
                    handleSuccessPrintInvoices={this.props.handleSuccessPrintInvoices}
                />
                <ListMonthlyInvoicesFilter
                    filter={this.props.filter}
                    handleFilterChange={this.props.handleFilterChange}
                />
            </div>
        );
    }
}

export default ListMonthlyInvoicesSidebar;
