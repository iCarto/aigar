import React from "react";
import {Spinner} from "components/common";
import {
    MembersTable,
    MembersFilter,
    MemberNewButton,
} from "components/member/presentation";
import {MemberService} from "service";
import "components/common/SideBar.css";

class ListMembers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            members: null,
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        this.loadMembers();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.members === null) {
            this.loadMembers();
        }
    }

    loadMembers(filter = null) {
        MemberService.getMembers(filter).then(members => {
            console.log("members", members);
            this.setState({members});
        });
    }

    handleFilterChange(name, value) {
        console.log("handleFilterChange", {name}, {value});
        let filter = {
            [name]: value,
        };
        this.loadMembers(filter);
    }

    render() {
        if (this.state.members) {
            return (
                <div className="h-100">
                    <div className="row h-100">
                        <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                            <div className="sidebar-sticky p-3 d-flex flex-column justify-content-between">
                                <MembersFilter handleChange={this.handleFilterChange} />
                                <MemberNewButton />
                            </div>
                        </nav>
                        <div className="col-md">
                            <MembersTable members={this.state.members} />
                        </div>
                    </div>
                </div>
            );
        } else {
            return <Spinner message="Cargando datos" />;
        }
    }
}

export default ListMembers;
