import React from "react";
import {MembersFilter, MemberNewButton} from "components/member/presentation";
import "components/common/SideBar.css";
import {DomainService} from "service/api";

class ListMembersSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            domain: {
                sectors: [],
                memberTypes: [],
            },
        };
    }

    componentDidMount() {
        this.loadDomains();
    }

    loadDomains() {
        console.log("loadDomains");
        Promise.all([DomainService.getSectors(), DomainService.getMemberTypes()]).then(
            results => {
                this.setState({
                    domain: {
                        sectors: results[0],
                        memberTypes: results[1],
                    },
                });
            }
        );
    }

    render() {
        return (
            <div className="sidebar-sticky d-flex flex-column">
                <div className="sidebar-group">
                    <label>Filtro</label>
                    <MembersFilter
                        filter={this.props.filter}
                        sectorsDomain={this.state.domain.sectors}
                        memberTypesDomain={this.state.domain.memberTypes}
                        handleChange={this.props.handleFilterChange}
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
