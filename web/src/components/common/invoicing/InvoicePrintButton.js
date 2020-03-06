import React from "react";
import {Spinner} from "components/common";
import {DocXPrintFileService, FileService} from "service/file";

class InvoicePrintButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            result: null,
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
                    this.setState({
                        loading: false,
                        result: {
                            type: "success",
                            msg: "El documento se ha generado correctamente",
                        },
                    });
                } catch (err) {
                    console.log(err);
                    this.setState({
                        loading: false,
                        result: {
                            type: "error",
                            msg:
                                "Se ha producido un error y no se ha podido generar el documento.",
                        },
                    });
                }
            }
        );
    }

    get message() {
        if (this.state.result) {
            return this.state.result.type === "error" ? (
                <div className="alert alert-danger mt-2" role="alert">
                    {this.state.result.msg}
                </div>
            ) : (
                <div className="alert alert-success mt-2" role="alert">
                    {this.state.result.msg}
                </div>
            );
        }
        return null;
    }

    get spinner() {
        return (
            <div className="d-flex align-items-center">
                <Spinner message="Generando factura" />
                <strong className="ml-2">Generando factura...</strong>
            </div>
        );
    }

    get button() {
        return (
            <button onClick={this.generateDoc} className="btn btn-secondary">
                <i className="fas fa-print mr-2" />
                {this.props.buttonTitle}
            </button>
        );
    }

    render() {
        return (
            <div className="column">
                {this.state.loading ? this.spinner : this.button}
                {this.message}
            </div>
        );
    }
}

export default InvoicePrintButton;
