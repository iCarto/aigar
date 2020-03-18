import React from "react";
import {Spinner} from "components/common";
import {InvoicesList} from "components/invoice/presentation";
import {InvoiceService} from "service/api";
import "components/common/SideBar.css";
import ListInvoicesSidebar from "./ListInvoicesSidebar";

class ListInvoices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoices: null,
        };
    }

    componentDidMount() {
        this.loadInvoices();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.invoices === null) {
            this.loadInvoices();
        }
    }

    loadInvoices() {
        InvoiceService.getInvoices().then(invoices => {
            console.log("invoices", invoices);
            this.setState({invoices});
        });
    }

    filter(invoices, filter) {
        return invoices.filter(invoice => {
            var filtered = true;
            if (filter) {
                if (filter.numero) {
                    filtered = invoice.numero.indexOf(filter.numero) >= 0;
                }
                if (filter.nombre) {
                    filtered = filtered && invoice.nombre.indexOf(filter.nombre) >= 0;
                }
                if (filter.sector) {
                    filtered = filtered && invoice.sector === parseInt(filter.sector);
                }
            }
            return filtered;
        });
    }

    get sidebar() {
        return (
            <ListInvoicesSidebar
                handleFilterChange={this.props.handleFilterChange}
                handleClickCreateInvoice={this.props.handleClickCreateInvoice}
                filter={this.props.filter}
            />
        );
    }

    get content() {
        if (this.state.invoices) {
            return (
                <InvoicesList
                    invoices={this.filter(this.state.invoices, this.props.filter)}
                    selectedPageIndex={this.props.selectedPageIndex}
                    handleChangePageIndex={this.props.handleChangePageIndex}
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

export default ListInvoices;
