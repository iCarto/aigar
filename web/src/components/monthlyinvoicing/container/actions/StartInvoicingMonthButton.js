import React from "react";
import {InvoicingMonthService} from "service/api";
import {
    OperationWithConfirmationContentModal,
    OperationWithConfirmationContentModalStatus,
} from "components/common/modal";
import {DateUtil} from "utilities";

class StartInvoicingMonthButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: null,
        };
        this.startInvoicingMonth = this.startInvoicingMonth.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);
        this.onClickAccept = this.onClickAccept.bind(this);
        this.onClickFinished = this.onClickFinished.bind(this);
    }

    startInvoicingMonth() {
        console.log("StartInvoicingMonthButton.startInvoicingMonth");
        this.setState(
            {status: OperationWithConfirmationContentModalStatus.PROGRESS},
            () => {
                InvoicingMonthService.startInvoicingMonth(
                    this.props.invoicingMonth,
                    false
                )
                    .then(invoicingMonth => {
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
        this.startInvoicingMonth();
    }

    onClickFinished() {
        this.closeModal();
        this.props.handleSuccessCreateInvoices(this.props.invoicingMonth);
    }

    get modalContentStart() {
        return (
            <p>
                ¿Desea iniciar la facturación del mes de&nbsp;
                <strong>
                    {DateUtil.getMonthName(this.props.invoicingMonth.mes)} -{" "}
                    {this.props.invoicingMonth.anho}
                </strong>
                ?
            </p>
        );
    }

    get modalContentFinished() {
        return (
            <p className="alert alert-success">
                Las facturas del mes de{" "}
                <strong>
                    {DateUtil.getMonthName(this.props.invoicingMonth.mes)} -{" "}
                    {this.props.invoicingMonth.anho}
                </strong>{" "}
                se han creado correctamente.
            </p>
        );
    }

    get modal() {
        return (
            <OperationWithConfirmationContentModal
                modal={this.state.modal}
                status={this.state.status}
                modalTitle="Iniciar mes de facturación"
                modalContentStart={this.modalContentStart}
                modalContentFinished={this.modalContentFinished}
                modalAcceptText="Iniciar"
                modalAcceptIcon="file-invoice"
                spinnerMessage="Generando facturas"
                modalErrorText="Se ha producido un error y no se han podido crear las facturas."
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
                {this.props.position ? this.props.position + ". " : null}
                Facturación
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

export default StartInvoicingMonthButton;
