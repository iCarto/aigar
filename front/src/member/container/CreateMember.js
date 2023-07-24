import React from "react";
import {MemberForm} from "member/presentational";

import {DataValidatorService} from "validation";

import CreateMemberSidebar from "./CreateMemberSidebar";
import {createMember} from "member/model";
import {DomainService} from "aigar/domain/service";
import {ErrorMessage} from "base/error/components";
import {MemberService} from "member/service";

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
            membersWithOrder: [],
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeOrder = this.handleChangeOrder.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBack = this.handleBack.bind(this);
    }

    componentDidMount() {
        this.loadDomains();
    }

    loadDomains() {
        console.log("loadDomains");
        Promise.all([DomainService.getSectors(), MemberService.getMembers()]).then(
            results => {
                const membersWithOrder = this.getMembersWithOrder(results[1]);
                // Add the new member to list at last position
                const orderForNewMember =
                    membersWithOrder[membersWithOrder.length - 1].order + 1;
                membersWithOrder.push({
                    id: this.state.member.num_socio,
                    order: orderForNewMember,
                    name: "<<Nuevo socio>>",
                });
                this.setState(prevState => {
                    return {
                        member: createMember(
                            Object.assign({}, prevState.member, {
                                orden: orderForNewMember,
                            })
                        ),
                        domain: {
                            sectors: results[0],
                        },
                        membersWithOrder,
                    };
                });
            }
        );
    }

    getMembersWithOrder(members) {
        let membersWithOrder = members
            .filter(member => member.is_active)
            .map(member => {
                return {
                    id: member.num_socio,
                    order: member.orden,
                    name: member.name,
                };
            });
        membersWithOrder.sort((a, b) => {
            return a.order - b.order;
        });
        return membersWithOrder;
    }

    handleChangeOrder(name, membersWithOrder) {
        const orderForItem = membersWithOrder.find(
            item => item.id === this.state.member.num_socio
        ).order;
        console.log("EditMember.handleChangeOrder", name, orderForItem);
        this.setState((prevState, props) => {
            const updatedMember = createMember(
                Object.assign({}, prevState.member, {[name]: orderForItem})
            );
            return {
                member: updatedMember,
                validationErrors: DataValidatorService.validateMember(updatedMember),
                membersWithOrder,
            };
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
                validationErrors: DataValidatorService.validateMember(updatedMember),
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
            <>
                <ErrorMessage message={this.state.errorMessage} />
                <MemberForm
                    member={this.state.member}
                    errors={this.state.validationErrors}
                    handleChange={this.handleChange}
                    handleSubmit={this.handleSubmit}
                    sectorsDomain={this.state.domain.sectors}
                    membersWithOrder={this.state.membersWithOrder}
                    handleChangeOrder={this.handleChangeOrder}
                    saving={this.state.isSaving}
                />
            </>
        );
    }

    render() {
        return (
            <>
                <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                    {this.sidebar}
                </nav>
                <div className="col-md-10 offset-md-2">
                    <div className="container">{this.content}</div>
                </div>
            </>
        );
    }
}

export default CreateMember;
