import React from "react";
import {Spinner} from "components/common";
import {MembersList} from "components/member/presentation";
import {MemberService} from "service/api";
import "components/common/SideBar.css";
import ListMembersSidebar from "./ListMembersSidebar";

class ListMembers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            members: null,
        };
    }

    componentDidMount() {
        this.loadMembers();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.members === null) {
            this.loadMembers();
        }
    }

    loadMembers() {
        MemberService.getMembers().then(members => {
            console.log("members", members);
            this.setState({members});
        });
    }

    filter(members, filter) {
        return members.filter(member => {
            var filtered = true;
            if (filter) {
                if (filter.name) {
                    filtered =
                        member.name.toLowerCase().indexOf(filter.name.toLowerCase()) >=
                        0;
                }
                if (filter.num_socio) {
                    filtered =
                        member.num_socio
                            .toString()
                            .indexOf(filter.num_socio.toString()) >= 0;
                }
                if (filter.sector) {
                    filtered = filtered && member.sector === parseInt(filter.sector);
                }
                if (filter.tipo_socio) {
                    filtered = filtered && member.tipo_socio === filter.tipo_socio;
                }
            }
            return filtered;
        });
    }

    get sidebar() {
        return (
            <ListMembersSidebar
                handleFilterChange={this.props.handleFilterChange}
                handleClickCreateMember={this.props.handleClickCreateMember}
                filter={this.props.filter}
            />
        );
    }

    get content() {
        if (this.state.members) {
            return (
                <MembersList
                    members={this.filter(this.state.members, this.props.filter)}
                    listView={this.props.listView}
                    handleChangeListView={this.props.handleChangeListView}
                    handleClickViewMember={this.props.handleClickViewMember}
                    filter={this.props.filter}
                />
            );
        }
        return <Spinner message="Cargando datos" />;
    }

    render() {
        return (
            <div className="h-100">
                <div className="row h-100">
                    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                        {this.sidebar}
                    </nav>
                    <div className="col-md-10 offset-md-2">
                        <div className="container">{this.content}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ListMembers;
