import React from "react";
import ViewInvoicesStatsFilter from "./ViewInvoicesStatsFilter";
import "components/common/SideBar.css";

class ViewInvoicesStatsSidebar extends React.Component {
    render() {
        return (
            <div className="sidebar-sticky d-flex flex-column">
                <ViewInvoicesStatsFilter
                    filter={this.props.filter}
                    handleFilterChange={this.props.handleFilterChange}
                />
            </div>
        );
    }
}

export default ViewInvoicesStatsSidebar;
