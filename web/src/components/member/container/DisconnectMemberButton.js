import React from "react";
import {MemberService} from "service/api";
import {MemberDisconnectStatus, MemberDisconnectButtonModal} from "../presentation";

class DisconnectMemberButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: null,
        };
        this.disconnectMember = this.disconnectMember.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);
        this.onClickAccept = this.onClickAccept.bind(this);
        this.onClickFinished = this.onClickFinished.bind(this);
    }

    disconnectMember() {
        console.log("DisconnectMemberButton.disconnectMember");
        this.setState({status: MemberDisconnectStatus.PROGRESS}, () => {
            MemberService.setMemberConnected(this.props.member, true)
                .then(disconnectedMember => {
                    this.setState({status: MemberDisconnectStatus.SUCCESS});
                })
                .catch(error => {
                    console.log(error);
                    this.setState({status: MemberDisconnectStatus.ERROR});
                });
        });
    }

    openModal() {
        this.setState({status: MemberDisconnectStatus.START});
    }

    closeModal() {
        this.setState({status: null});
    }

    onClickCancel() {
        this.closeModal();
    }

    onClickAccept() {
        this.disconnectMember();
    }

    onClickFinished() {
        this.closeModal();
        this.props.handleSuccessDisconnectMember();
    }

    get modalContentStart() {
        return (
            <p>
                ¿Desea desconectar el socio&nbsp;
                <strong>
                    {this.props.member.num_socio} - {this.props.member.name}
                </strong>
                ?
                <br />
                Para este socio se seguirán creando facturas mensuales para mantener
                actualizado el costo del servicio cuando vuelva a ser conectado.
            </p>
        );
    }

    get modalContentFinished() {
        return (
            <p className="alert alert-success">
                El socio ha sido desconectado del sistema.
            </p>
        );
    }

    get modal() {
        return (
            <MemberDisconnectButtonModal
                member={this.props.member}
                modal={this.state.modal}
                status={this.state.status}
                modalTitle="Desconectar socio"
                modalContentStart={this.modalContentStart}
                modalContentFinished={this.modalContentFinished}
                modalAcceptText="Desconectar"
                modalAcceptIcon="tint-slash"
                spinnerMessage="Desconectando socio"
                onClickCancel={this.onClickCancel}
                onClickAccept={this.onClickAccept}
                onClickFinished={this.onClickFinished}
            />
        );
    }

    get button() {
        return (
            <button
                className="btn btn-secondary"
                disabled={this.props.disabled}
                onClick={this.openModal}
            >
                <i className="fas fa-tint-slash mr-2" />
                Desconectar
            </button>
        );
    }

    render() {
        return !this.props.hidden ? (
            <>
                {this.button}
                {this.modal}
            </>
        ) : null;
    }
}

export default DisconnectMemberButton;
