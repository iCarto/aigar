import React from "react";
import "components/common/SideBar.css";
import {ViewInvoice} from "components/invoice/container";
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
            filteredInvoicesIds: [],
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
        this.handleClickViewInvoice = this.handleClickViewInvoice.bind(this);
        this.handleBackFromViewInvoice = this.handleBackFromViewInvoice.bind(this);
        this.handleClickViewMember = this.handleClickViewMember.bind(this);
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

    handleClickViewInvoice(id_factura, filteredInvoicesIds) {
        console.log("handleClickEditInvoice", id_factura, filteredInvoicesIds);
        if (!filteredInvoicesIds) {
            filteredInvoicesIds = this.state.filteredInvoicesIds;
        }
        this.setState({
            selectedInvoice: id_factura,
            filteredInvoicesIds,
        });
    }

    handleBackFromViewInvoice() {
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
                <ViewInvoice
                    id_factura={this.state.selectedInvoice}
                    navigatorIds={this.state.filteredInvoicesIds}
                    handleClickSelectInNavigator={this.handleClickViewInvoice}
                    handleBack={this.handleBackFromViewInvoice}
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
                    handleClickViewInvoice={this.handleClickViewInvoice}
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
