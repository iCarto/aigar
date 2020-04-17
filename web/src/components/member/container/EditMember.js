import React from "react";
import {Spinner, ErrorMessage} from "components/common";
import {MemberForm} from "components/member/presentation";
import {createMember} from "model";
import {MemberService, DomainService} from "service/api";
import {DataValidatorService} from "service/validation";
import EditMemberSidebar from "./EditMemberSidebar";

class EditMember extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            domain: {
                sectors: [],
            },
            member: null,
            num_socio: null,
            validationErrors: null,
            isLoading: null,
            isSaving: null,
            errorMessage: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBack = this.handleBack.bind(this);
    }

    // https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change
    // Esto nos permitiría navegar entre miembros con algún componente de más alto nivel y solo cambiando el número de socio
    static getDerivedStateFromProps(props, prevState) {
        // Store prevNumSocio in state so we can compare when props change.
        // Clear out previously-loaded data (so we don't render stale stuff).
        const num_socio = parseInt(props.num_socio || props.match.params.num_socio);
        if (num_socio !== prevState.num_socio) {
            return {
                member: null,
                num_socio,
            };
        }
        return null;
    }

    componentDidMount() {
        this.loadDomains();
        this.loadMember();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.num_socio !== this.state.num_socio) {
            this.loadMember();
        }
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

    loadMember() {
        MemberService.getMember(this.state.num_socio)
            .then(member => {
                this.setState({
                    member,
                    isLoading: false,
                    errorMessage: member.is_active ? null : "El socio ha sido borrado.",
                });
            })
            .catch(error => {
                this.setState({
                    errorMessage:
                        "Se ha producido un error y no se han podido obtener los datos del socio",
                    isLoading: false,
                });
            });
    }

    handleChange(name, value) {
        console.log("EditMember.handleChange", name, value);
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
        MemberService.updateMember(this.state.member)
            .then(updatedMember => {
                this.setState({
                    isSaving: false,
                });
                if (this.props.handleSubmit) {
                    this.props.handleSubmit(updatedMember);
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

        //this.props.history.push("/socios/" + this.props.match.params.num_socio);
    }

    handleBack() {
        console.log("EditMember.handleBack");
        if (this.props.handleBack) {
            this.props.handleBack();
        } else {
            this.props.history.push("/socios/" + this.state.member.num_socio);
        }
    }

    get sidebar() {
        return <EditMemberSidebar handleBack={this.handleBack} />;
    }

    get content() {
        if (this.state.isLoading) {
            return <Spinner message="Cargando datos" />;
        }
        return (
            <>
                <ErrorMessage message={this.state.errorMessage} />
                <MemberForm
                    member={this.state.member}
                    errors={this.state.validationErrors}
                    handleChange={this.handleChange}
                    handleSubmit={this.handleSubmit}
                    sectorsDomain={this.state.domain.sectors}
                    saving={this.state.isSaving}
                />
            </>
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

export default EditMember;
