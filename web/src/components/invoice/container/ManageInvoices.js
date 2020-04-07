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
        };
        this.handleChangePageIndex = this.handleChangePageIndex.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleClickEditInvoice = this.handleClickEditInvoice.bind(this);
        this.handleBackEditInvoice = this.handleBackEditInvoice.bind(this);
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

    handleClickEditInvoice(id_factura) {
        console.log("handleClickEditInvoice", id_factura);
        this.setState({
            selectedInvoice: id_factura,
        });
    }

    handleBackEditInvoice() {
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
                    handleBack={this.handleBackEditInvoice}
                />
            );
        }
        return (
            <ListInvoices
                selectedPageIndex={this.state.pagination.pageIndex}
                handleChangePageIndex={this.handleChangePageIndex}
                handleFilterChange={this.handleFilterChange}
                handleClickEditInvoice={this.handleClickEditInvoice}
                filter={this.state.filter}
            />
        );
    }
}

export default ManageInvoices;
