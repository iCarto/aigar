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

    filter(invoices, filter) {
        if (invoices) {
            return invoices.filter(invoice => {
                var filtered = true;
                if (filter) {
                    if (filter.nombre) {
                        filtered =
                            filtered && invoice.nombre.indexOf(filter.nombre) >= 0;
                    }
                    if (filter.sector) {
                        filtered =
                            filtered && invoice.sector === parseInt(filter.sector);
                    }
                    if (filter.tipo_socio) {
                        filtered = filtered && invoice.tipo_socio === filter.tipo_socio;
                    }
                    if (filter.estado) {
                        filtered = filtered && invoice.estado === filter.estado;
                    }
                }
                return filtered;
            });
        }
        return [];
    }

    get sidebar() {
        return (
            <ListMonthlyInvoicesSidebar
                handleFilterChange={this.handleFilterChange}
                filter={this.props.filter}
                invoices={this.filter(this.state.invoices, this.props.filter)}
            />
        );
    }

    get content() {
        if (this.state.invoices) {
            return (
                <MonthlyInvoicingList
                    invoices={this.filter(this.state.invoices, this.props.filter)}
                    selectedPageIndex={this.props.selectedPageIndex}
                    handleChangePageIndex={this.props.handleChangePageIndex}
                    handleClickViewMember={this.props.handleClickViewMember}
                    handleClickEditInvoice={this.props.handleClickEditInvoice}
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
