import React from "react";
import {MemberForm} from "components/member/presentation";
import {createMember} from "model";
import {DataValidatorService} from "service/validation";
import {MemberService} from "service/api";
import CreateMemberSidebar from "./CreateMemberSidebar";

class CreateMember extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            member: createMember(),
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBack = this.handleBack.bind(this);
    }

    handleChange(name, value) {
        console.log("CreateMember.handleChange", {name}, {value});
        this.setState((prevState, props) => {
            const updatedMember = createMember(
                Object.assign({}, prevState.member, {[name]: value})
            );
            return {
                member: updatedMember,
                errors: DataValidatorService.validateMember(updatedMember),
            };
        });
    }

    handleSubmit() {
        console.log("CreateMember.handleSubmit", this.state.member);
        MemberService.createMember(this.state.member).then(updatedMember => {
            console.log(updatedMember);
            this.props.handleSubmit(updatedMember.num_socio);
        });
    }

    handleBack() {
        console.log("CreateMember.handleBack");
        if (this.props.handleBack) {
            this.props.handleBack();
        } else {
            this.props.history.push("/socios");
        }
    }

    get sidebar() {
        return <CreateMemberSidebar handleBack={this.handleBack} />;
    }

    get content() {
        return (
            <MemberForm
                member={this.state.member}
                errors={this.state.errors}
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
                cancelUrl={"/socios"}
            />
        );
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

export default CreateMember;
