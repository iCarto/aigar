import React from "react";
import {Spinner} from "components/common";
import {MemberForm} from "components/member/presentation";
import {createMember} from "model";
import {MemberService} from "service";
import {DataValidatorService} from "service/validation";

class EditMember extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            member: null,
            prevNumSocio: null,
            errors: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change
    // Esto nos permitiría navegar entre miembros con algún componente de más alto nivel y solo cambiando el número de socio
    static getDerivedStateFromProps(props, prevState) {
        // Store prevNumSocio in state so we can compare when props change.
        // Clear out previously-loaded data (so we don't render stale stuff).
        const num_socio = parseInt(props.match.params.num_socio);
        if (num_socio !== prevState.prevNumSocio) {
            return {
                member: null,
                prevNumSocio: num_socio,
            };
        }
        return null;
    }

    componentDidMount() {
        this.loadMember(parseInt(this.props.match.params.num_socio));
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.member === null) {
            this.loadMember(parseInt(this.props.match.params.num_socio));
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

    render() {
        if (this.state.member) {
            return (
                <MemberForm
                    member={this.state.member}
                    errors={this.state.errors}
                    handleChange={this.handleChange}
                    handleSubmit={this.handleSubmit}
                    cancelUrl={"/socios/" + this.state.member.num_socio}
                />
            );
        } else {
            return <Spinner message="Cargando datos" />;
        }
    }
}

export default EditMember;
