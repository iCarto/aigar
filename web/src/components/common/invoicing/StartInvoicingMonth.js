import React from "react";
import {Spinner} from "components/common";
import StartInvoicingMonthModal from "./StartInvoicingMonthModal";

class StartInvoicingMonth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            modal: false,
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        this.acceptModal = this.acceptModal.bind(this);
    }

    startInvoicingMonth() {
        console.log("StartInvoicingMonth.startInvoicingMonth");
        this.props.handleClickStartInvoicingMonth();
    }

    openModal() {
        this.setState({modal: true});
    }

    closeModal() {
        this.setState({modal: false});
    }

    cancelModal() {
        this.closeModal();
    }

    acceptModal() {
        this.closeModal();
        this.startInvoicingMonth();
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
                <Spinner message="Iniciando mes" />
                <strong className="ml-2">Iniciando mes...</strong>
            </div>
        );
    }

    get modal() {
        return (
            <StartInvoicingMonthModal
                invoicingMonth={this.props.invoicingMonth}
                modal={this.state.modal}
                acceptModal={this.acceptModal}
                cancelModal={this.cancelModal}
            />
        );
    }

    get button() {
        return (
            <>
                <button
                    className="btn btn-secondary mt-2 mb-2"
                    disabled={this.props.disabled}
                    onClick={this.openModal}
                >
                    1. Iniciar facturación
                </button>
            </>
        );
    }

    render() {
        return !this.props.hidden ? (
            <>
                {this.state.loading ? this.spinner : this.button}
                {this.modal}
                {this.message}
            </>
        ) : null;
    }
}

export default StartInvoicingMonth;
