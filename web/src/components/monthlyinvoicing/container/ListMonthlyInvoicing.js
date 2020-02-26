import React from "react";
import {Spinner} from "components/common";
import {InvoiceService} from "service";
import InvoiceButton from "components/common/invoicing/InvoiceButton";
import {
    MonthlyInvoicingTable,
    MonthlyInvoicingFilter,
    MonthlyInvoicingCalendar,
} from "../presentation";
import "components/common/SideBar.css";
import moment from "moment";

class ListMonthlyInvoicing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoices: null,
            filter: {
                month: moment().month(),
                year: moment().year(),
            },
        };
        this.handleDateChange = this.handleDateChange.bind(this);
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

    loadInvoices() {
        InvoiceService.getInvoices(this.state.filter).then(invoices => {
            console.log("invoices", invoices);
            this.setState({invoices});
        });
    }

    handleDateChange(year, month) {
        console.log("handleDateChange", {year}, {month});
        this.setState(
            {
                filter: {
                    month,
                    year,
                },
            },
            () => {
                this.loadInvoices();
            }
        );
    }

    handleFilterChange(name, value) {
        console.log("handleFilterChange", {name}, {value});
        this.setState(
            {
                filter: {
                    ...this.state.filter,
                    [name]: value,
                },
            },
            () => {
                this.loadInvoices();
            }
        );
    }

    getOutputFilename() {
        return (
            "recibo_" +
            this.state.invoiceYear +
            "_" +
            this.state.invoiceMonth +
            "_todos"
        );
    }

    render() {
        if (this.state.invoices) {
            return (
                <div className="h-100">
                    <div className="row h-100">
                        <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                            <div className="sidebar-sticky p-3 d-flex flex-column justify-content-between">
                                <MonthlyInvoicingFilter
                                    handleChange={this.handleFilterChange}
                                />
                                <InvoiceButton
                                    invoices={this.state.invoices}
                                    buttonTitle="Generar facturación mensual"
                                    outputFilename={this.getOutputFilename()}
                                />
                            </div>
                        </nav>
                        <div className="col-md-10 offset-md-2">
                            <MonthlyInvoicingCalendar
                                month={this.state.filter.month}
                                year={this.state.filter.year}
                                handleChange={this.handleDateChange}
                            />
                            <MonthlyInvoicingTable invoices={this.state.invoices} />
                        </div>
                    </div>
                </div>
            );
        } else {
            return <Spinner message="Cargando datos" />;
        }
    }
}

export default ListMonthlyInvoicing;
