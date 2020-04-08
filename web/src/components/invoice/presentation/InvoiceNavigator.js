import React from "react";

class InvoiceNavigator extends React.Component {
    constructor(props) {
        super(props);
        this.handleClickPreviousInvoice = this.handleClickPreviousInvoice.bind(this);
        this.handleClickNextInvoice = this.handleClickNextInvoice.bind(this);
    }

    findSelectedIndex() {
        return this.props.navigatorIds.findIndex(id => id === this.props.selectedId);
    }

    handleClickPreviousInvoice() {
        this.props.handleClickSelect(
            this.props.navigatorIds[this.findSelectedIndex() - 1]
        );
    }

    handleClickNextInvoice() {
        this.props.handleClickSelect(
            this.props.navigatorIds[this.findSelectedIndex() + 1]
        );
    }

    isPreviousButtonDisabled() {
        return this.findSelectedIndex() === 0;
    }

    isNextButtonDisabled() {
        return this.findSelectedIndex() === this.props.navigatorIds.length - 1;
    }

    render() {
        return (
            <div className="text-center mb-2" style={{borderBottom: "1px solid #ccc"}}>
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
