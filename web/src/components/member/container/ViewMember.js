import React from "react";
import {Spinner} from "components/common";
import {ListMemberInvoices} from "components/member/container";
import {MemberDetail} from "components/member/presentation";
import {MemberService} from "service/api";
import ViewMemberSidebar from "./ViewMemberSidebar";
import EditMember from "./EditMember";

class ViewMember extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            member: null,
            num_socio: null,
            errors: null,
            view: "view",
        };
        this.handleBack = this.handleBack.bind(this);
        this.handleClickEditMember = this.handleClickEditMember.bind(this);
        this.handleSubmitEditMember = this.handleSubmitEditMember.bind(this);
        this.handleBackEditMember = this.handleBackEditMember.bind(this);
    }

    static getDerivedStateFromProps(props, prevState) {
        const num_socio = props.num_socio || parseInt(props.match.params.num_socio);
        if (num_socio !== prevState.num_socio) {
            return {
                member: null,
                num_socio,
            };
        }
        return null;
    }

    componentDidMount() {
        this.loadMember();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.member === null) {
            this.loadMember();
        }
    }

    loadMember() {
        MemberService.getMember(this.state.num_socio).then(member => {
            console.log("member", member);
            this.setState({member});
        });
    }

    handleBack() {
        console.log("ViewMember.handleBack");
        if (this.props.handleBack) {
            this.props.handleBack();
        } else {
            this.props.history.push("/socios");
        }
    }

    handleClickEditMember() {
        this.setState({view: "edit"});
    }

    handleBackEditMember() {
        this.setState({view: "view"});
        this.loadMember();
    }

    handleSubmitEditMember(member) {
        this.setState({view: "view", member});
    }

    get sidebar() {
        if (this.state.view === "edit") {
            return null;
        }
        return (
            <ViewMemberSidebar
                handleClickEditMember={this.handleClickEditMember}
                handleBack={this.handleBack}
            />
        );
    }

    get content() {
        if (this.state.view === "edit") {
            return (
                <EditMember
                    num_socio={this.state.num_socio}
                    handleSubmit={this.handleSubmitEditMember}
                    handleBack={this.handleBackEditMember}
                />
            );
        }
        return (
            <>
                <MemberDetail member={this.state.member} />
                <ListMemberInvoices num_socio={this.state.member.num_socio} />
            </>
        );
    }

    render() {
        if (this.state.member) {
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
        return <Spinner message="Cargando datos" />;
    }
}

export default ViewMember;
