import React from "react";
import {InvoicesFilter} from "components/invoice/presentation";
import "components/common/SideBar.css";

class ListInvoicesSidebar extends React.Component {
    render() {
        return (
            <div className="sidebar-sticky d-flex flex-column">
                <div className="sidebar-group">
                    <label>Filtro</label>
                    <InvoicesFilter
                        filter={this.props.filter}
                        handleChange={this.props.handleFilterChange}
                    />
                </div>
            </div>
        );
    }
}

export default ListInvoicesSidebar;
