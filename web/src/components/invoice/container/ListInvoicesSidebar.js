import React from "react";
import "components/common/SideBar.css";
import ListInvoicesFilter from "./ListInvoicesFilter";

class ListInvoicesSidebar extends React.Component {
    render() {
        return (
            <div className="sidebar-sticky d-flex flex-column">
                <div className="sidebar-group">
                    <label>Filtro</label>
                    <ListInvoicesFilter
                        filter={this.props.filter}
                        handleFilterChange={this.props.handleFilterChange}
                    />
                </div>
            </div>
        );
    }
}

export default ListInvoicesSidebar;
