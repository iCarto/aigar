import React from "react";
import {MemberNewButton} from "components/member/presentation";
import "components/common/SideBar.css";
import ListMembersFilter from "./ListMembersFilter";

class ListMembersSidebar extends React.Component {
    render() {
        return (
            <div className="sidebar-sticky d-flex flex-column">
                <div className="sidebar-group">
                    <label>Filtro</label>
                    <ListMembersFilter
                        filter={this.props.filter}
                        handleFilterChange={this.props.handleFilterChange}
                    />
                </div>
                <div className="sidebar-group mt-auto">
                    <label>Acciones</label>
                    <div className="d-flex flex-column text-center">
                        <div className="mt-4 mb-4">
                            <MemberNewButton
                                handleClickCreateMember={
                                    this.props.handleClickCreateMember
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ListMembersSidebar;
