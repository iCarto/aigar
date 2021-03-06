import React from "react";
import {MemberService} from "service/api";
import {
    OperationWithConfirmationContentModal,
    OperationWithConfirmationContentModalStatus,
} from "components/common/modal";

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
        this.setState(
            {status: OperationWithConfirmationContentModalStatus.PROGRESS},
            () => {
                MemberService.setMemberConnected(this.props.member, true)
                    .then(disconnectedMember => {
                        this.setState({
                            status: OperationWithConfirmationContentModalStatus.SUCCESS,
                        });
                    })
                    .catch(error => {
                        console.log(error);
                        this.setState({
                            status: OperationWithConfirmationContentModalStatus.ERROR,
                        });
                    });
            }
        );
    }

    openModal() {
        this.setState({status: OperationWithConfirmationContentModalStatus.START});
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
            <OperationWithConfirmationContentModal
                modal={this.state.modal}
                status={this.state.status}
                modalTitle="Desconectar socio"
                modalContentStart={this.modalContentStart}
                modalContentFinished={this.modalContentFinished}
                modalAcceptText="Desconectar"
                modalAcceptIcon="tint-slash"
                spinnerMessage="Desconectando socio"
                modalErrorText="Se ha producido un error y no se ha podido desconectar el socio."
                onClickCancel={this.onClickCancel}
                onClickAccept={this.onClickAccept}
                onClickFinished={this.onClickFinished}
            />
        );
    }

    get button() {
        return (
            <button
                className="btn btn-secondary mt-1 mb-1"
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
