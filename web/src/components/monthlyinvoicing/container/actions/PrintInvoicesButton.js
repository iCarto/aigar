import React from "react";
import {
    OperationWithConfirmationContentModal,
    OperationWithConfirmationContentModalStatus,
} from "components/common/modal";
import {DocXPrintFileService, FileService} from "service/file";
import {InvoiceService} from "service/api";
import {ESTADOS_FACTURA} from "model";

class PrintInvoicesButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: null,
            errorMessage: null,
        };
        this.printInvoices = this.printInvoices.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);
        this.onClickAccept = this.onClickAccept.bind(this);
        this.onClickFinished = this.onClickFinished.bind(this);
    }

    printInvoices() {
        this.setState(
            {
                status: OperationWithConfirmationContentModalStatus.PROGRESS,
                errorMessage: null,
            },
            async () => {
                try {
                    console.log(this.props.invoices);
                    const data = {
                        invoices: this.props.invoices,
                    };
                    const invoicesDocument = await DocXPrintFileService.generateInvoicesDocument(
                        data,
                        this.props.outputFilename
                    );
                    FileService.saveDataToFile(
                        invoicesDocument,
                        this.props.outputFilename + ".docx",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    );
                    InvoiceService.updateInvoiceStatus(
                        this.props.invoices
                            .filter(invoice => invoice.estado === ESTADOS_FACTURA.NUEVA)
                            .map(invoice => invoice.id_factura),
                        ESTADOS_FACTURA.PENDIENTE_DE_COBRO
                    )
                        .then(result => {
                            this.setState({
                                status:
                                    OperationWithConfirmationContentModalStatus.SUCCESS,
                                errorMessage: null,
                            });
                        })
                        .catch(error => {
                            console.log(error);
                            this.setState({
                                status:
                                    OperationWithConfirmationContentModalStatus.ERROR,
                                errorMessage:
                                    "No se ha podido actualizar el estado de la factura.",
                            });
                        });
                } catch (err) {
                    console.log(err);
                    this.setState({
                        status: OperationWithConfirmationContentModalStatus.ERROR,
                        errorMessage: "No se ha podido generar el documento.",
                    });
                }
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
        this.printInvoices();
    }

    onClickFinished() {
        this.closeModal();
        this.props.handleSuccessPrintInvoices();
    }

    get modalContentStart() {
        return (
            <p>
                Procederá a imprimir{" "}
                {this.props.invoices && this.props.invoices.length === 1
                    ? "la factura"
                    : "las facturas"}
                . ¿Ha revisado previamente si es necesario añadir otros importes como
                asambleas, nuevos derechos, reconexiones, traspasos...?
            </p>
        );
    }

    get modalContentFinished() {
        return (
            <p className="alert alert-success">
                El documento se ha generado documento correctamente.
            </p>
        );
    }

    get modalContentError() {
        return (
            <>
                Se ha producido un error y no se han podido generar el documento.
                <br />
                <strong>
                    {this.state.errorMessage ? this.state.errorMessage.message : null}
                </strong>
            </>
        );
    }

    get modal() {
        return (
            <OperationWithConfirmationContentModal
                modal={this.state.modal}
                status={this.state.status}
                modalTitle="Imprimir facturas"
                modalContentStart={this.modalContentStart}
                modalContentFinished={this.modalContentFinished}
                modalAcceptText="Imprimir"
                modalAcceptIcon="print"
                spinnerMessage="Generando documento"
                modalErrorText={this.modalContentError}
                onClickCancel={this.onClickCancel}
                onClickAccept={this.onClickAccept}
                onClickFinished={this.onClickFinished}
            />
        );
    }

    get button() {
        return (
            <button
                className="btn btn-primary mt-1 mb-1"
                disabled={this.props.disabled}
                onClick={this.openModal}
            >
                {this.props.showIcon === true ? <i className="fa fa-print" /> : null}
                &nbsp;
                {this.props.position ? this.props.position + "." : null}&nbsp;
                {this.props.buttonTitle ? this.props.buttonTitle : "Imprimir factura"}
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

export default PrintInvoicesButton;
