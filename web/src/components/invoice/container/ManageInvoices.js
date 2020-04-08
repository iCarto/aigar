import React from "react";
import "components/common/SideBar.css";
import ListInvoices from "./ListInvoices";
import ViewInvoice from "./ViewInvoice";

class ManageInvoices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pagination: {
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
        this.handleChangePageIndex = this.handleChangePageIndex.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleClickViewInvoice = this.handleClickViewInvoice.bind(this);
        this.handleBackFromViewInvoice = this.handleBackFromViewInvoice.bind(this);
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
        console.log("handleBackEditInvoice");
        this.setState({
            selectedInvoice: null,
        });
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
        return (
            <ListInvoices
                selectedPageIndex={this.state.pagination.pageIndex}
                handleChangePageIndex={this.handleChangePageIndex}
                handleFilterChange={this.handleFilterChange}
                handleClickViewInvoice={this.handleClickViewInvoice}
                filter={this.state.filter}
            />
        );
    }
}

export default ManageInvoices;
