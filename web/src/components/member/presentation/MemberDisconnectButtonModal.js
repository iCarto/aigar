import React from "react";
import {Modal, ModalHeader, ModalBody, ModalFooter} from "components/common/modal";
import {Spinner} from "components/common";

export const MemberDisconnectStatus = {
    START: "start",
    PROGRESS: "progress",
    SUCCESS: "success",
    ERROR: "error",
};

class MemberDisconnectButtonModal extends React.Component {
    get closeButton() {
        return (
            <button
                type="button"
                className="close"
                aria-label="Close"
                onClick={
                    this.props.status === MemberDisconnectStatus.SUCCESS
                        ? this.props.onClickFinished
                        : this.props.onClickCancel
                }
            >
                <span aria-hidden="true">&times;</span>
            </button>
        );
    }

    get cancelButton() {
        return (
            <button
                type="button"
                className="btn btn-secondary"
                onClick={this.props.onClickCancel}
            >
                Cancelar
            </button>
        );
    }

    get acceptButton() {
        return (
            <button
                type="button"
                className="btn btn-primary"
                onClick={this.props.onClickAccept}
            >
                <i className={"mr-2 fas fa-" + this.props.modalAcceptIcon} />
                {this.props.modalAcceptText}
            </button>
        );
    }

    get finishedButton() {
        return (
            <button
                type="button"
                className="btn btn-primary"
                onClick={this.props.onClickFinished}
            >
                <i className="fas fa-times mr-2" />
                Cerrar
            </button>
        );
    }

    get startView() {
        return (
            <>
                <ModalHeader>
                    <h3>{this.props.modalTitle}</h3>
                    {this.closeButton}
                </ModalHeader>
                <ModalBody>{this.props.modalContentStart}</ModalBody>
                <ModalFooter>
                    {this.cancelButton}
                    {this.acceptButton}
                </ModalFooter>
            </>
        );
    }

    get progressView() {
        return (
            <>
                <ModalHeader>
                    <h3>{this.props.modalTitle}</h3>
                </ModalHeader>
                <ModalBody>
                    <Spinner message={this.props.spinnerMessage} />
                </ModalBody>
                <ModalFooter></ModalFooter>
            </>
        );
    }

    get successView() {
        return (
            <>
                <ModalHeader>
                    <h3>{this.props.modalTitle}</h3>
                    {this.closeButton}
                </ModalHeader>
                <ModalBody>{this.props.modalContentFinished}</ModalBody>
                <ModalFooter>{this.finishedButton}</ModalFooter>
            </>
        );
    }

    get errorView() {
        return (
            <>
                <ModalHeader>
                    <h3>Desconectar socio</h3>
                    {this.closeButton}
                </ModalHeader>
                <ModalBody>
                    <p className="alert alert-danger">
                        Se ha producido un error y no se ha podido desconectar el socio.
                    </p>
                </ModalBody>
                <ModalFooter></ModalFooter>
            </>
        );
    }

    get content() {
        if (this.props.status === "progress") {
            return this.progressView;
        }
        if (this.props.status === "success") {
            return this.successView;
        }
        if (this.props.status === "error") {
            return this.errorView;
        }
        return this.startView;
    }

    render() {
        return <Modal isOpen={this.props.status != null}>{this.content}</Modal>;
    }
}

export default MemberDisconnectButtonModal;
