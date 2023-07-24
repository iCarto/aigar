import React from "react";
import {MonthlyInvoicingNavigator} from "../presentational";
import ListMonthlyInvoicesActions from "./ListMonthlyInvoicesActions";

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
            </div>
        );
    }
}

export default ListMonthlyInvoicesSidebar;
