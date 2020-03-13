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
        return (
            <InvoicesList
                invoices={this.state.invoices}
                selectedPageIndex={this.props.selectedPageIndex}
                handleChangePageIndex={this.props.handleChangePageIndex}
                handleClickEditInvoice={this.props.handleClickEditInvoice}
                filter={this.props.filter}
            />
        );
    }

    render() {
        if (this.state.invoices) {
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
        return <Spinner message="Cargando datos" />;
    }
}

export default ListInvoices;
