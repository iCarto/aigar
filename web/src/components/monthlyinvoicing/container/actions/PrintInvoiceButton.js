import React from "react";
import {Spinner} from "components/common";
import {DocXPrintFileService, FileService} from "service/file";
import {InvoiceService} from "service/api";
import {ESTADOS_FACTURA} from "model";

class PrintInvoiceButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            messageError: null,
        };
        this.generateDoc = this.generateDoc.bind(this);
    }

    generateDoc() {
        this.setState(
            {
                loading: true,
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
                        this.props.invoices.map(invoice => invoice.id_factura),
                        ESTADOS_FACTURA.PENDIENTE_DE_COBRO
                    )
                        .then(result => {
                            this.setState({
                                loading: false,
                            });
                            this.props.handleSuccessPrintedInvoices();
                        })
                        .catch(error => {
                            console.log(error);
                            this.setState({
                                loading: false,
                                messageError:
                                    "No se ha podido actualizar el estado de la factura.",
                            });
                        });
                } catch (err) {
                    console.log(err);
                    this.setState({
                        loading: false,
                        messageError: "No se ha podido generar el documento.",
                    });
                }
            }
        );
    }

    get message() {
        return this.state.messageError ? (
            <div className="alert alert-danger mt-2" role="alert">
                {this.state.messageError}
            </div>
        ) : null;
    }

    get spinner() {
        return (
            <div className="d-flex align-items-center">
                <Spinner message="Generando factura" />
            </div>
        );
    }

    get button() {
        return (
            <button
                onClick={this.generateDoc}
                className="btn btn-primary mt-1 mb-1"
                disabled={this.props.disabled}
            >
                {this.props.buttonTitle}
            </button>
        );
    }

    render() {
        return !this.props.hidden ? (
            <>
                {this.state.loading ? this.spinner : this.button}
                {this.message}
            </>
        ) : null;
    }
}

export default PrintInvoiceButton;
