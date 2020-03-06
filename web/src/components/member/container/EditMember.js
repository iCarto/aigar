import React from "react";
import {Spinner} from "components/common";
import {MemberForm} from "components/member/presentation";
import {createMember} from "model";
import {MemberService} from "service/api";
import {DataValidatorService} from "service/validation";

class EditMember extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            member: null,
            num_socio: null,
            errors: null,
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
        this.loadMember(parseInt(this.state.num_socio));
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.member === null) {
            this.loadMember(parseInt(this.state.num_socio));
        }
    }

    loadMember(num_socio) {
        if (num_socio) {
            MemberService.getMember(num_socio).then(member => {
                console.log("member", member);
                this.setState({member});
            });
        }
    }

    handleChange(name, value) {
        console.log("EditMember.handleChange", name, value);
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
        console.log("EditMember.handleSubmit", this.state);
        this.props.history.push("/socios/" + this.props.match.params.num_socio);
    }

    handleBack() {
        this.props.handleBack
            ? this.props.handleBack()
            : this.props.history.push("/socios");
    }

    render() {
        if (this.state.member) {
            return (
                <div className="container">
                    <MemberForm
                        member={this.state.member}
                        errors={this.state.errors}
                        handleChange={this.handleChange}
                        handleSubmit={this.handleSubmit}
                        handleBack={this.handleBack}
                    />
                </div>
            );
        } else {
            return <Spinner message="Cargando datos" />;
        }
    }
}

export default EditMember;
