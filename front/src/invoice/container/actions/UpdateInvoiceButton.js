import React from "react";

import {
    OperationWithConfirmationContentModal,
    OperationWithConfirmationContentModalStatus,
} from "base/ui/modal";
import {ESTADOS_FACTURA} from "invoice/model";
import {InvoiceService} from "invoice/service";

class UpdateInvoiceButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: null,
            invoice_new_version: null,
        };
        this.handleClick = this.handleClick.bind(this);
        this.createNewInvoiceVersion = this.createNewInvoiceVersion.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);
        this.onClickAccept = this.onClickAccept.bind(this);
        this.onClickFinished = this.onClickFinished.bind(this);
    }

    handleClick() {
        if (this.props.invoice.estado === ESTADOS_FACTURA.NUEVA) {
            this.props.handleClickEditInvoice();
        } else {
            this.openModal();
        }
    }

    createNewInvoiceVersion() {
        console.log("StartInvoicingMonthButton.startInvoicingMonth");
        this.setState(
            {status: OperationWithConfirmationContentModalStatus.PROGRESS},
            () => {
                InvoiceService.createNewInvoiceVersion(this.props.invoice.id_factura)
                    .then(invoiceNewVersion => {
                        this.setState({
                            status: OperationWithConfirmationContentModalStatus.SUCCESS,
                            invoice_new_version: invoiceNewVersion,
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
        this.createNewInvoiceVersion();
    }

    onClickFinished() {
        this.closeModal();
        this.props.handleSuccessCreateNewInvoiceVersion(
            this.state.invoice_new_version.id_factura,
            this.props.invoice.id_factura
        );
    }

    get modalContentStart() {
        return (
            <p>
                Esta factura ya ha sido emitida.
                <br /> Si desea modificarla debe crear una nueva versión.
            </p>
        );
    }

    get modalContentFinished() {
        return (
            <p className="alert alert-success">
                Se ha creado correctamente la nueva versión de la factura.
            </p>
        );
    }

    get modal() {
        return (
            <OperationWithConfirmationContentModal
                modal={this.state.modal}
                status={this.state.status}
                modalTitle="Modificar factura"
                modalContentStart={this.modalContentStart}
                modalContentFinished={this.modalContentFinished}
                modalAcceptText="Crear una nueva versión"
                modalAcceptIcon="file-invoice"
                spinnerMessage="Anulando factura anterior"
                modalErrorText="Se ha producido un error y no se ha podido crear la nueva versión para la factura."
                onClickCancel={this.onClickCancel}
                onClickAccept={this.onClickAccept}
                onClickFinished={this.onClickFinished}
            />
        );
    }

    get button() {
        return (
            <button
                className={
                    "btn mb-1 mt-1 " +
                    (this.props.invoice.estado === ESTADOS_FACTURA.NUEVA
                        ? "btn-primary"
                        : "btn-secondary")
                }
                disabled={this.props.disabled}
                onClick={this.handleClick}
            >
                <i className="fa fa-edit" /> Cambiar datos
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

export default UpdateInvoiceButton;
