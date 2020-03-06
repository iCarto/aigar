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
            num_socio: null,
            errors: null,
        };
    }

    static getDerivedStateFromProps(props, prevState) {
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

    loadMember(num_socio) {
        if (num_socio) {
            MemberService.getMember(num_socio).then(member => {
                console.log("member", member);
                this.setState({member});
            });
        }
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
