import React from "react";
import {Spinner} from "components/common";
import {InvoicesTable, InvoicesFilter} from "components/invoice/presentation";
import {InvoiceService} from "service/api";
import "components/common/SideBar.css";

class ListInvoices extends React.Component {
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
        if (this.state.invoices === null) {
            this.loadInvoices();
        }
    }

    loadInvoices(filter = null) {
        InvoiceService.getInvoices(filter).then(invoices => {
            console.log("invoices", invoices);
            this.setState({invoices});
        });
    }

    handleFilterChange(name, value) {
        console.log("handleFilterChange", {name}, {value});
        let filter = {
            [name]: value,
        };
        this.loadInvoices(filter);
    }

    render() {
        if (this.state.invoices) {
            return (
                <div className="h-100">
                    <div className="row h-100">
                        <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                            <div className="sidebar-sticky">
                                <InvoicesFilter
                                    handleChange={this.handleFilterChange}
                                />
                            </div>
                        </nav>
                        <div className="col-md-10 offset-md-2">
                            <InvoicesTable invoices={this.state.invoices} />
                        </div>
                    </div>
                </div>
            );
        } else {
            return <Spinner message="Cargando datos" />;
        }
    }
}

export default ListInvoices;
