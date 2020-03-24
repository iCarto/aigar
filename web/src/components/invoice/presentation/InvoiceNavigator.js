import React from "react";

class InvoiceNavigator extends React.Component {
    constructor(props) {
        super(props);
        this.handleClickPreviousInvoice = this.handleClickPreviousInvoice.bind(this);
        this.handleClickNextInvoice = this.handleClickNextInvoice.bind(this);
    }

    handleClickPreviousInvoice() {
        this.props.handleClickNavigatorInvoice(-1);
    }

    handleClickNextInvoice() {
        this.props.handleClickNavigatorInvoice(1);
    }

    isPreviousButtonDisabled() {
        return false;
    }

    isNextButtonDisabled() {
        return false;
    }

    render() {
        const {month, year} = this.props;

        return (
            <div className="text-center">
                <form className="form-inline d-flex justify-content-between m-1">
                    <button
                        type="button"
                        className="btn mr-1"
                        onClick={this.handleClickPreviousInvoice}
                        disabled={this.isPreviousButtonDisabled()}
                    >
                        &laquo; Factura anterior
                    </button>
                    <button
                        type="button"
                        className="btn ml-1"
                        onClick={this.handleClickNextInvoice}
                        disabled={this.isNextButtonDisabled()}
                    >
                        Siguiente factura &raquo;
                    </button>
                </form>
            </div>
        );
    }
}

export default InvoiceNavigator;
