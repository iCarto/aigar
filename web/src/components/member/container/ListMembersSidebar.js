import React from "react";
import {MemberNewButton} from "components/member/presentation";
import "components/common/SideBar.css";
import ListMembersFilter from "./ListMembersFilter";

class ListMembersSidebar extends React.Component {
    render() {
        return (
            <div className="sidebar-sticky d-flex flex-column">
                <div className="d-flex flex-column text-center p-3">
                    <MemberNewButton
                        handleClickCreateMember={this.props.handleClickCreateMember}
                    />
                </div>
                <ListMembersFilter
                    filter={this.props.filter}
                    handleFilterChange={this.props.handleFilterChange}
                />
            </div>
        );
    }
}

export default ListMembersSidebar;
