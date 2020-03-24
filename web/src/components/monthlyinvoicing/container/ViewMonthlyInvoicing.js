import React from "react";
import "components/common/SideBar.css";
import {EditInvoice} from "components/invoice/container";
import {ViewMember} from "components/member/container";
import ListMonthlyInvoices from "./ListMonthlyInvoices";
import {InvoiceService} from "service/api";
import {Spinner} from "components/common";

class ViewMonthlyInvoicing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoicingMonth: {
                month: null,
                year: null,
            },
            pagination: {
                pageIndex: 0,
            },
            filter: {
                month: null,
                year: null,
                nombre: "",
                sector: 0,
                tipo_socio: 0,
                estado: 0,
            },
            selectedInvoice: null,
            selectedMember: null,
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleChangePageIndex = this.handleChangePageIndex.bind(this);
        this.handleClickEditInvoice = this.handleClickEditInvoice.bind(this);
        this.handleClickViewMember = this.handleClickViewMember.bind(this);
        this.handleBackFromEditInvoice = this.handleBackFromEditInvoice.bind(this);
        this.handleBackFromViewMember = this.handleBackFromViewMember.bind(this);
    }

    componentDidMount() {
        console.log(
            "componentDidUpdate",
            this.state.filter.month,
            this.state.filter.year
        );
        if (this.state.filter.month === null) {
            this.loadInvoicingMonth();
        }
    }

    loadInvoicingMonth() {
        InvoiceService.getInvoicingMonth().then(invoicingMonth => {
            console.log("invoicingMonth", invoicingMonth);
            this.setState((prevState, props) => {
                return {
                    invoicingMonth,
                    filter: Object.assign(prevState.filter, invoicingMonth),
                    pagination: {pageIndex: 0},
                };
            });
        });
    }

    handleChangePageIndex(pageIndex) {
        console.log("handleChangePageIndex", {pageIndex});
        this.setState({pagination: {pageIndex}});
    }

    handleFilterChange(newFilter) {
        console.log("handleFilterChange", newFilter);
        this.setState({
            filter: Object.assign(this.state.filter, newFilter),
            pagination: {pageIndex: 0},
        });
    }

    handleClickEditInvoice(numero) {
        console.log("handleSelectInvoice", numero);
        this.setState({
            selectedInvoice: numero,
        });
    }

    handleBackFromEditInvoice() {
        console.log("handleBackFromInvoice");
        this.setState({
            selectedInvoice: null,
        });
    }

    handleClickViewMember(numero_socio) {
        console.log("handleSelectMember", numero_socio);
        this.setState({
            selectedMember: numero_socio,
        });
    }

    handleBackFromViewMember() {
        console.log("handleBackFromMember");
        this.setState({
            selectedMember: null,
        });
    }

    render() {
        if (this.state.selectedInvoice) {
            return (
                <EditInvoice
                    id_factura={this.state.selectedInvoice}
                    handleBack={this.handleBackFromEditInvoice}
                />
            );
        }
        if (this.state.selectedMember) {
            return (
                <div className="col-md-12">
                    <ViewMember
                        num_socio={this.state.selectedMember}
                        handleBack={this.handleBackFromViewMember}
                    />
                </div>
            );
        }
        if (this.state.filter.month != null) {
            return (
                <ListMonthlyInvoices
                    selectedPageIndex={this.state.pagination.pageIndex}
                    handleFilterChange={this.handleFilterChange}
                    handleChangePageIndex={this.handleChangePageIndex}
                    handleClickEditInvoice={this.handleClickEditInvoice}
                    handleClickViewMember={this.handleClickViewMember}
                    filter={this.state.filter}
                    invoicingMonth={this.state.invoicingMonth}
                />
            );
        }
        return <Spinner message="Cargando mes de facturación" />;
    }
}

export default ViewMonthlyInvoicing;
