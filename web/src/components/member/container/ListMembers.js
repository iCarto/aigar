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
                    members={this.state.members}
                    selectedPageIndex={this.props.selectedPageIndex}
                    handleChangePageIndex={this.props.handleChangePageIndex}
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
