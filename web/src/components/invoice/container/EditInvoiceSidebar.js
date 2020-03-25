import React from "react";
import {BackButton} from "components/common";
import {PrintInvoiceButton} from "components/monthlyinvoicing/container/actions";

class EditInvoiceSidebar extends React.Component {
    getOutputFilename() {
        if (this.props.invoice) {
            return "recibo_" + this.props.invoice.numero;
        }
        return null;
    }

    render() {
        return (
            <div className="sidebar-sticky d-flex flex-column">
                <div className="sidebar-group">
                    <div className="d-flex flex-column text-center">
                        <div className="mt-1 mb-1">
                            <BackButton handleBack={this.props.handleBack} />
                        </div>
                    </div>
                </div>
                <div className="sidebar-group mt-auto">
                    <label>Acciones</label>
                    <div className="d-flex flex-column text-center">
                        <div className="mt-4 mb-4">
                            <PrintInvoiceButton
                                invoices={[this.props.invoice]}
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

export default EditInvoiceSidebar;
