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
                <div className="sidebar-group">
                    <label>Navegación por meses</label>
                    <MonthlyInvoicingNavigator
                        selectedInvoicingMonth={this.props.selectedInvoicingMonth}
                        invoicingMonths={this.props.invoicingMonths}
                        handleChangeInvoicingMonth={
                            this.props.handleChangeInvoicingMonth
                        }
                    />
                </div>
                <div className="sidebar-group">
                    <label>Acciones</label>
                    <div className="d-flex flex-column">
                        <ListMonthlyInvoicesActions
                            selectedInvoicingMonth={this.props.selectedInvoicingMonth}
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
