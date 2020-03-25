import React from "react";
import {MemberService} from "service/api";
import {
    OperationWithConfirmationContentModal,
    OperationWithConfirmationContentModalStatus,
} from "components/common/modal";

class ConnectMemberButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: null,
        };
        this.connectMember = this.connectMember.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);
        this.onClickAccept = this.onClickAccept.bind(this);
        this.onClickFinished = this.onClickFinished.bind(this);
    }

    connectMember() {
        console.log("ConnectMemberButton.disconnectMember");
        this.setState(
            {status: OperationWithConfirmationContentModalStatus.PROGRESS},
            () => {
                MemberService.setMemberConnected(this.props.member, false)
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
        this.connectMember();
    }

    onClickFinished() {
        this.closeModal();
        this.props.handleSuccessConnectMember();
    }

    get modalContentStart() {
        return (
            <p>
                ¿Desea volver a conectar al socio&nbsp;
                <strong>
                    {this.props.member.num_socio} - {this.props.member.name}
                </strong>
                ?
            </p>
        );
    }

    get modalContentFinished() {
        return (
            <p className="alert alert-success">
                El socio ha sido reconectado del sistema.
            </p>
        );
    }

    get modal() {
        return (
            <OperationWithConfirmationContentModal
                modal={this.state.modal}
                status={this.state.status}
                modalTitle="Volver a conectar socio"
                modalContentStart={this.modalContentStart}
                modalContentFinished={this.modalContentFinished}
                modalAcceptText="Conectar"
                modalAcceptIcon="tint"
                spinnerMessage="Conectando socio"
                modalErrorText="Se ha producido un error y no se ha podido conectar el socio."
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
                <i className="fas fa-tint mr-2" />
                Conectar
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

export default ConnectMemberButton;
