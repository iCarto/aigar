import React from "react";
import {MemberForm} from "components/member/presentation";
import {createMember} from "model";
import {DataValidatorService} from "service/validation";
import {MemberService, DomainService} from "service/api";
import CreateMemberSidebar from "./CreateMemberSidebar";

class CreateMember extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            domain: {
                sectors: [],
            },
            member: createMember(),
            validationErrors: [],
            isSaving: null,
            errorMessage: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBack = this.handleBack.bind(this);
    }

    componentDidMount() {
        this.loadDomains();
    }

    loadDomains() {
        console.log("loadDomains");
        Promise.all([DomainService.getSectors()]).then(results => {
            this.setState({
                domain: {
                    sectors: results[0],
                },
            });
        });
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
        this.setState({
            isSaving: true,
            errorMessage: null,
        });
        MemberService.createMember(this.state.member)
            .then(createdMember => {
                this.setState({
                    isSaving: false,
                });
                if (this.props.handleSubmit) {
                    this.props.handleSubmit(createdMember.num_socio);
                } else {
                    this.handleBack();
                }
            })
            .catch(error => {
                this.setState({
                    errorMessage:
                        "Se ha producido un error y no se han podido almacenar los datos del socio",
                    isSaving: false,
                });
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
                errors={this.state.validationErrors}
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
                sectorsDomain={this.state.domain.sectors}
                saving={this.state.isSaving}
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
