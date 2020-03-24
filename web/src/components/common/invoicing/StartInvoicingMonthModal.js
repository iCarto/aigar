import React from "react";
import {Modal, ModalHeader, ModalBody, ModalFooter} from "components/common/modal";
import {DateUtil} from "components/util";

class StartInvoicingMonthModal extends React.Component {
    render() {
        return (
            <Modal isOpen={this.props.modal}>
                <ModalHeader>
                    <h3>Iniciar facturación</h3>
                    <button
                        type="button"
                        className="close"
                        aria-label="Close"
                        onClick={this.props.cancelModal}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </ModalHeader>
                <ModalBody>
                    <p>
                        Desea iniciar la facturación del mes de{" "}
                        <strong>
                            {DateUtil.getMonthName(this.props.invoicingMonth.month)} -{" "}
                            {this.props.invoicingMonth.year}
                        </strong>
                    </p>
                </ModalBody>
                <ModalFooter>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={this.props.cancelModal}
                    >
                        No
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.props.acceptModal}
                    >
                        Sí
                    </button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default StartInvoicingMonthModal;
