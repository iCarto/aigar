import React from "react";
import {MemberForm} from "components/member/presentation";
import {createMember} from "model";
import {DataValidatorService} from "service/validation";

class CreateMember extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            member: createMember(),
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(name, value) {
        console.log("NewMember.handleChange", name, value);
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
        console.log("NewMember.handleSubmit", this.state);
        //this.props.history.push("/socios/" + num_socio);
    }

    render() {
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
}

export default CreateMember;
