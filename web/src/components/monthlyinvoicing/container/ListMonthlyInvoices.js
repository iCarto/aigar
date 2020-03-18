import React from "react";
import {Spinner} from "components/common";
import {InvoiceService} from "service/api";
import "components/common/SideBar.css";
import ListMonthlyInvoicesSidebar from "./ListMonthlyInvoicesSidebar";
import {MonthlyInvoicingList} from "../presentation";

class ListMonthlyInvoices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoices: null,
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        this.loadInvoices();
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("componentDidUpdate", this.state.invoices);
        if (this.state.invoices === null) {
            this.loadInvoices();
        }
    }

    loadInvoices() {
        InvoiceService.getInvoicesByYearAndMonth(
            this.props.filter.year,
            this.props.filter.month
        ).then(invoices => {
            console.log("invoices", invoices);
            this.setState({invoices});
        });
    }

    handleFilterChange(newFilter) {
        console.log("handleFilterChange", newFilter);
        if (newFilter.year != null && newFilter.month != null) {
            this.setState({
                invoices: null,
            });
        }
        this.props.handleFilterChange(newFilter);
    }

    get sidebar() {
        return (
            <ListMonthlyInvoicesSidebar
                handleFilterChange={this.handleFilterChange}
                filter={this.props.filter}
            />
        );
    }

    get content() {
        if (this.state.invoices) {
            return (
                <MonthlyInvoicingList
                    invoices={this.state.invoices}
                    selectedPageIndex={this.props.selectedPageIndex}
                    handleChangePageIndex={this.props.handleChangePageIndex}
                    handleClickViewMember={this.props.handleClickViewMember}
                    handleClickEditInvoice={this.props.handleClickEditInvoice}
                    filter={this.props.filter}
                />
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
                    <div className="col-md-10 offset-md-2">
                        <div className="container">{this.content}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ListMonthlyInvoices;
