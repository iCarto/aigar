import React from "react";
import {Modal, ModalHeader, ModalBody, ModalFooter} from "components/common/modal";
import {Spinner} from "components/common";

export const MemberDeleteStatus = {
    START: "start",
    PROGRESS: "progress",
    SUCCESS: "success",
    ERROR: "error",
};

class MemberDeleteButtonModal extends React.Component {
    get startView() {
        return (
            <>
                <ModalHeader>
                    <h3>Eliminar socio</h3>
                    <button
                        type="button"
                        className="close"
                        aria-label="Close"
                        onClick={this.props.onClickCancel}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </ModalHeader>
                <ModalBody>
                    <p>
                        Desea eliminar el socio&nbsp;
                        <strong>
                            {this.props.member.num_socio} - {this.props.member.name}
                        </strong>
                    </p>
                </ModalBody>
                <ModalFooter>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={this.props.onClickCancel}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.props.onClickAccept}
                    >
                        <i className="fas fa-trash mr-2" />
                        Aceptar
                    </button>
                </ModalFooter>
            </>
        );
    }

    get progressView() {
        return (
            <>
                <ModalHeader>
                    <h3>Eliminar socio</h3>
                </ModalHeader>
                <ModalBody>
                    <Spinner message="Eliminando socio" />
                </ModalBody>
                <ModalFooter></ModalFooter>
            </>
        );
    }

    get successView() {
        return (
            <>
                <ModalHeader>
                    <h3>Eliminar socio</h3>
                    <button
                        type="button"
                        className="close"
                        aria-label="Close"
                        onClick={this.props.onClickFinished}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </ModalHeader>
                <ModalBody>
                    <p className="alert alert-success">
                        El socio ha sido eliminado del sistema.
                    </p>
                </ModalBody>
                <ModalFooter>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.props.onClickFinished}
                    >
                        <i className="fas fa-list mr-2" />
                        Volver al listado
                    </button>
                </ModalFooter>
            </>
        );
    }

    get errorView() {
        return (
            <>
                <ModalHeader>
                    <h3>Eliminar socio</h3>
                    <button
                        type="button"
                        className="close"
                        aria-label="Close"
                        onClick={this.props.onClickFinished}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </ModalHeader>
                <ModalBody>
                    <p className="alert alert-danger">
                        Se ha producido un error y no se ha podido eliminar el socio.
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

export default MemberDeleteButtonModal;
