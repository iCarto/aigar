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
            listView: {
                sortBy: [],
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
        this.handleChangeListView = this.handleChangeListView.bind(this);
        this.handleClickViewInvoice = this.handleClickViewInvoice.bind(this);
        this.handleBackFromViewInvoice = this.handleBackFromViewInvoice.bind(this);
        this.handleClickViewMember = this.handleClickViewMember.bind(this);
        this.handleBackFromViewMember = this.handleBackFromViewMember.bind(this);
        this.handleChangeInvoicingMonth = this.handleChangeInvoicingMonth.bind(this);
        this.handleSuccessCreateInvoices = this.handleSuccessCreateInvoices.bind(this);
        this.handleSuccessCreateNewInvoiceVersion = this.handleSuccessCreateNewInvoiceVersion.bind(
            this
        );
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
            const invoicingMonthOpened = invoicingMonths.find(
                invoicingMonth => invoicingMonth.is_open
            );
            // Next month add to allow the creation of a new monthly invoicing process
            invoicingMonths.push(
                InvoicingMonthService.getNextInvoicingMonthToCreate(
                    invoicingMonthOpened
                )
            );
            this.setState({
                invoicingMonths,
                selectedInvoicingMonth: invoicingMonthOpened,
            });
        });
    }

    handleChangeListView(listView) {
        console.log("handleChangeListView", {listData: listView});
        this.setState({
            listView,
        });
    }

    handleFilterChange(newFilter) {
        console.log("handleFilterChange", newFilter);
        this.setState({
            filter: Object.assign(this.state.filter, newFilter),
            listView: Object.assign(this.state.listView, {pageIndex: 0}),
        });
    }

    handleClickViewInvoice(id_factura, filteredInvoicesIds) {
        console.log("handleClickViewInvoice", id_factura, filteredInvoicesIds);
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

    handleSuccessCreateNewInvoiceVersion(
        new_version_id_factura,
        old_version_id_factura
    ) {
        // Replace old version id
        const filteredInvoicesIds = this.state.filteredInvoicesIds.map(invoiceId =>
            invoiceId === old_version_id_factura ? new_version_id_factura : invoiceId
        );
        this.setState({
            selectedInvoice: new_version_id_factura,
            filteredInvoicesIds,
        });
    }

    render() {
        if (this.state.selectedInvoice) {
            return (
                <ViewInvoice
                    id_factura={this.state.selectedInvoice}
                    navigatorIds={this.state.filteredInvoicesIds}
                    handleSuccessCreateNewInvoiceVersion={
                        this.handleSuccessCreateNewInvoiceVersion
                    }
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
                    listView={this.state.listView}
                    handleFilterChange={this.handleFilterChange}
                    handleChangeListView={this.handleChangeListView}
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
