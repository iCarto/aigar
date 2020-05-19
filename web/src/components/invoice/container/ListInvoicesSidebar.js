import React from "react";
import "components/common/SideBar.css";
import ListInvoicesFilter from "./ListInvoicesFilter";

class ListInvoicesSidebar extends React.Component {
    render() {
        return (
            <div className="sidebar-sticky d-flex flex-column">
                <ListInvoicesFilter
                    filter={this.props.filter}
                    handleFilterChange={this.props.handleFilterChange}
                />
            </div>
        );
    }
}

export default ListInvoicesSidebar;
