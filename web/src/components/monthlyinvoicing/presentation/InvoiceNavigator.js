import React from "react";

class InvoiceNavigator extends React.Component {
    constructor(props) {
        super(props);
        this.handleInvoiceChangePrevious = this.handleInvoiceChangePrevious.bind(this);
        this.handleInvoiceChangeNext = this.handleInvoiceChangeNext.bind(this);
    }

    findIndexInFacturasList() {
        return this.props.num_facturas_list.indexOf(this.props.num_factura);
    }

    handleInvoiceChangePrevious() {
        const index = this.findIndexInFacturasList();
        this.props.handleSelectInvoice(this.props.num_facturas_list[index - 1]);
    }

    handleInvoiceChangeNext() {
        const index = this.findIndexInFacturasList();
        this.props.handleSelectInvoice(this.props.num_facturas_list[index + 1]);
    }

    isPreviousButtonDisabled() {
        return this.props.num_facturas_list.indexOf(this.props.num_factura) === 0;
    }

    isNextButtonDisabled() {
        return (
            this.findIndexInFacturasList() === this.props.num_facturas_list.length - 1
        );
    }

    render() {
        return (
            <div className="mb-3 row justify-content-between">
                <button
                    type="button"
                    className="btn btn-primary mr-3"
                    onClick={this.handleInvoiceChangePrevious}
                    disabled={this.isPreviousButtonDisabled()}
                >
                    &laquo; Factura anterior
                </button>
                <button
                    type="button"
                    className="btn btn-primary mr-3"
                    onClick={this.handleInvoiceChangeNext}
                    disabled={this.isNextButtonDisabled()}
                >
                    Factura siguiente &raquo;
                </button>
            </div>
        );
    }
}

export default InvoiceNavigator;
