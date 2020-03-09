import React from "react";
import InvoicePrintButton from "components/common/invoicing/InvoicePrintButton";
import BackToMonthInfo from "components/common/invoicing/BackToMonthInfo";

class ViewInvoiceSidebar extends React.Component {
    getOutputFilename() {
        return "recibo_" + this.props.num_factura;
    }

    render() {
        return (
            <div className="sidebar-sticky p-3 d-flex flex-column">
                <div className="p-2">
                    <BackToMonthInfo handleBack={this.props.handleBack} />
                </div>
                <div className="p-2">
                    <InvoicePrintButton
                        invoices={this.props.num_factura}
                        buttonTitle="Imprimir factura"
                        outputFilename={this.getOutputFilename()}
                    />
                </div>
            </div>
        );
    }
}

export default ViewInvoiceSidebar;
