import React from "react";
import {Spinner} from "components/common";
import {InvoicingMonthService} from "service/api";
import "components/common/SideBar.css";
import ListMonthlyInvoicesSidebar from "./ListMonthlyInvoicesSidebar";
import {MonthlyInvoicingList} from "../presentation";

class ListMonthlyInvoices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoices: null,
        };
    }

    componentDidMount() {
        console.log("ListMonthlyInvoices.componentDidMount");
        this.loadInvoices();
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("ListMonthlyInvoices.componentDidUpdate");
        if (
            prevProps.selectedInvoicingMonth.id_mes_facturacion !==
            this.props.selectedInvoicingMonth.id_mes_facturacion
        ) {
            this.loadInvoices();
        }
    }

    loadInvoices() {
        this.setState({invoices: null}, () => {
            InvoicingMonthService.getInvoicingMonthInvoices(
                this.props.selectedInvoicingMonth.id_mes_facturacion
            )
                .then(invoices => {
                    console.log("invoices", invoices);
                    this.setState({invoices});
                })
                .catch(error => {
                    this.setState({invoices: []});
                });
        });
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
        return null;
    }

    render() {
        const filteredInvoices = this.filter(this.state.invoices, this.props.filter);
        return (
            <div className="h-100">
                <div className="row h-100">
                    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                        <ListMonthlyInvoicesSidebar
                            filter={this.props.filter}
                            invoices={filteredInvoices}
                            invoicingMonths={this.props.invoicingMonths}
                            selectedInvoicingMonth={this.props.selectedInvoicingMonth}
                            handleChangeInvoicingMonth={
                                this.props.handleChangeInvoicingMonth
                            }
                            handleSuccessCreateInvoices={
                                this.props.handleSuccessCreateInvoices
                            }
                            handleFilterChange={this.props.handleFilterChange}
                        />
                    </nav>
                    <div className="col-md-10 offset-md-2">
                        <div className="container">
                            {filteredInvoices ? (
                                <MonthlyInvoicingList
                                    invoices={filteredInvoices}
                                    selectedPageIndex={this.props.selectedPageIndex}
                                    handleChangePageIndex={
                                        this.props.handleChangePageIndex
                                    }
                                    handleClickViewMember={
                                        this.props.handleClickViewMember
                                    }
                                    handleClickEditInvoice={
                                        this.props.handleClickEditInvoice
                                    }
                                />
                            ) : (
                                <Spinner message="Cargando datos" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ListMonthlyInvoices;
