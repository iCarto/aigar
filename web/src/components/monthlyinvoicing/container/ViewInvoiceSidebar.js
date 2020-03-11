import React from "react";
import InvoicePrintButton from "components/common/invoicing/InvoicePrintButton";
import BackToMonthInfo from "components/common/invoicing/BackToMonthInfo";

class ViewInvoiceSidebar extends React.Component {
    getOutputFilename() {
        return "recibo_" + this.props.num_factura;
    }

    render() {
        return (
            <div className="sidebar-sticky d-flex flex-column">
                <div className="sidebar-group">
                    <div className="d-flex flex-column text-center">
                        <div className="mt-1 mb-1">
                            <BackToMonthInfo handleBack={this.props.handleBack} />
                        </div>
                    </div>
                </div>
                <div className="sidebar-group mt-auto">
                    <label>Acciones</label>
                    <div className="d-flex flex-column text-center">
                        <div className="mt-4 mb-4">
                            <InvoicePrintButton
                                invoices={this.props.num_factura}
                                buttonTitle="Imprimir factura"
                                outputFilename={this.getOutputFilename()}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ViewInvoiceSidebar;
