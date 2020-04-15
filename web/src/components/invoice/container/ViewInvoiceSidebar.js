import React from "react";
import {BackButton} from "components/common";
import {PrintInvoiceButton} from "components/monthlyinvoicing/container/actions";
import UpdateInvoiceButton from "./actions/UpdateInvoiceButton";

class ViewInvoiceSidebar extends React.Component {
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
                {this.props.invoice ? (
                    <div className="sidebar-group mt-auto">
                        <label>Acciones</label>
                        <div className="d-flex flex-column text-center">
                            {this.props.invoice.is_active ? (
                                <UpdateInvoiceButton
                                    invoice={this.props.invoice}
                                    hidden={this.props.invoice.is_active === false}
                                    handleClickEditInvoice={
                                        this.props.handleClickEditInvoice
                                    }
                                    handleSuccessCreateNewInvoiceVersion={
                                        this.props.handleSuccessCreateNewInvoiceVersion
                                    }
                                />
                            ) : null}
                            <div className="mt-1 mb-4">
                                <PrintInvoiceButton
                                    invoices={[this.props.invoice]}
                                    buttonTitle="Imprimir factura"
                                    outputFilename={this.getOutputFilename()}
                                    handleSuccessPrintedInvoices={
                                        this.props.handleSuccessPrintedInvoices
                                    }
                                />
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default ViewInvoiceSidebar;
