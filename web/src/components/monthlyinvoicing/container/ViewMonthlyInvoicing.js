import React from "react";
import "components/common/SideBar.css";
import {EditInvoice} from "components/invoice/container";
import {ViewMember} from "components/member/container";
import ListMonthlyInvoices from "./ListMonthlyInvoices";
import {InvoicingMonthService} from "service/api";
import {Spinner} from "components/common";

class ViewMonthlyInvoicing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoicingMonths: null,
            selectedInvoicingMonth: null,
            selectedInvoice: null,
            selectedMember: null,
            pagination: {
                pageIndex: 0,
            },
            filter: {
                nombre: "",
                sector: 0,
                tipo_socio: 0,
                estado: 0,
            },
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleChangePageIndex = this.handleChangePageIndex.bind(this);
        this.handleClickEditInvoice = this.handleClickEditInvoice.bind(this);
        this.handleClickViewMember = this.handleClickViewMember.bind(this);
        this.handleBackFromEditInvoice = this.handleBackFromEditInvoice.bind(this);
        this.handleBackFromViewMember = this.handleBackFromViewMember.bind(this);
        this.handleChangeInvoicingMonth = this.handleChangeInvoicingMonth.bind(this);
        this.handleSuccessCreateInvoices = this.handleSuccessCreateInvoices.bind(this);
    }

    componentDidMount() {
        console.log(
            "componentDidUpdate",
            this.state.filter.month,
            this.state.filter.year
        );
        if (this.state.invoicingMonths === null) {
            this.loadInvoicingMonths();
        }
    }

    loadInvoicingMonths() {
        InvoicingMonthService.getInvoicingMonths().then(invoicingMonths => {
            const selectedInvoicingMonth = invoicingMonths.find(
                invoicingMonth => invoicingMonth.is_open
            );
            this.setState({invoicingMonths, selectedInvoicingMonth});
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

    handleChangeInvoicingMonth(selectedInvoicingMonth) {
        console.log("handleChangeInvoicingMonth");
        this.setState({selectedInvoicingMonth});
    }

    handleSuccessCreateInvoices() {
        console.log("handleSuccessCreateInvoices");
        this.loadInvoicingMonths();
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
        if (this.state.selectedInvoicingMonth != null) {
            return (
                <ListMonthlyInvoices
                    selectedPageIndex={this.state.pagination.pageIndex}
                    handleFilterChange={this.handleFilterChange}
                    handleChangePageIndex={this.handleChangePageIndex}
                    handleClickEditInvoice={this.handleClickEditInvoice}
                    handleClickViewMember={this.handleClickViewMember}
                    filter={this.state.filter}
                    invoicingMonths={this.state.invoicingMonths}
                    selectedInvoicingMonth={this.state.selectedInvoicingMonth}
                    handleChangeInvoicingMonth={this.handleChangeInvoicingMonth}
                    handleSuccessCreateInvoices={this.handleSuccessCreateInvoices}
                />
            );
        }
        return <Spinner message="Cargando mes de facturación" />;
    }
}

export default ViewMonthlyInvoicing;
