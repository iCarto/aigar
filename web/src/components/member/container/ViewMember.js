import React from "react";
import {Spinner} from "components/common";
import {ListMemberInvoices} from "components/member/container";
import {MemberDetail} from "components/member/presentation";
import {MemberService} from "service/api";

class ViewMember extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            member: null,
            prevNumSocio: null,
            errors: null,
        };
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

    render() {
        if (this.state.member) {
            return (
                <div>
                    <MemberDetail member={this.state.member} />
                    <ListMemberInvoices num_socio={this.state.member.num_socio} />
                </div>
            );
        } else {
            return <Spinner message="Cargando datos" />;
        }
    }
}

export default ViewMember;
