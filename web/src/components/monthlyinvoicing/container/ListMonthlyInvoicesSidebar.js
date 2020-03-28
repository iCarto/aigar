import React from "react";
import {MonthlyInvoicingCalendar} from "../presentation";
import ListMonthlyInvoicesActions from "./ListMonthlyInvoicesActions";
import ListMonthlyInvoicesFilter from "./ListMonthlyInvoicesFilter";

class ListMonthlyInvoicesSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    handleDateChange(year, month) {
        console.log("handleDateChange", {year}, {month});
        this.props.handleFilterChange({month, year});
    }

    get filterSelectedYearMonth() {
        return {
            year: this.props.filter.year,
            month: this.props.filter.month,
        };
    }

    render() {
        console.log("this.props.filter", this.props.filter);
        return (
            <div className="sidebar-sticky d-flex flex-column">
                <div className="sidebar-group">
                    <label>Navegación por meses</label>
                    <MonthlyInvoicingCalendar
                        yearMonth={this.filterSelectedYearMonth}
                        handleChange={this.handleDateChange}
                    />
                </div>
                <div className="sidebar-group">
                    <label>Acciones</label>
                    <div className="d-flex flex-column">
                        <ListMonthlyInvoicesActions
                            yearMonth={this.filterSelectedYearMonth}
                            invoicingMonth={this.props.invoicingMonth}
                            invoices={this.props.invoices}
                            handleSuccessCreateInvoices={
                                this.props.handleSuccessCreateInvoices
                            }
                        />
                    </div>
                </div>
                <div className="sidebar-group mt-auto mb-5">
                    <label>Filtro</label>
                    <ListMonthlyInvoicesFilter
                        filter={this.props.filter}
                        handleFilterChange={this.props.handleFilterChange}
                    />
                </div>
            </div>
        );
    }
}

export default ListMonthlyInvoicesSidebar;
