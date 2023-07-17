import React from "react";
import "components/common/SideBar.css";
import ListInvoices from "./ListInvoices";
import ViewInvoice from "./ViewInvoice";

class ManageInvoices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listView: {
                sortBy: [],
                pageIndex: 0,
            },
            filter: {
                numero: "",
                nombre: "",
                sector: 0,
            },
            selectedInvoice: null,
            filteredInvoicesIds: [],
        };
        this.handleChangeListView = this.handleChangeListView.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleClickViewInvoice = this.handleClickViewInvoice.bind(this);
        this.handleBackFromViewInvoice = this.handleBackFromViewInvoice.bind(this);
        this.handleSuccessCreateNewInvoiceVersion = this.handleSuccessCreateNewInvoiceVersion.bind(
            this
        );
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
        console.log("handleBackEditInvoice");
        this.setState({
            selectedInvoice: null,
        });
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
                    handleClickSelectInNavigator={this.handleClickViewInvoice}
                    handleSuccessCreateNewInvoiceVersion={
                        this.handleSuccessCreateNewInvoiceVersion
                    }
                    handleBack={this.handleBackFromViewInvoice}
                />
            );
        }
        return (
            <ListInvoices
                listView={this.state.listView}
                handleChangeListView={this.handleChangeListView}
                handleFilterChange={this.handleFilterChange}
                handleClickViewInvoice={this.handleClickViewInvoice}
                filter={this.state.filter}
            />
        );
    }
}

export default ManageInvoices;
