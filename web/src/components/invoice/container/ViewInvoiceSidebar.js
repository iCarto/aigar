import React from "react";
import {BackButton} from "components/common";
import {PrintInvoicesButton} from "components/monthlyinvoicing/container/actions";
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
                <div className="d-flex flex-column text-center">
                    <div className="mt-1 mb-1">
                        <BackButton handleBack={this.props.handleBack} />
                    </div>
                </div>
                {this.props.invoice ? (
                    <div className="d-flex flex-column text-center pr-4 pl-4">
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
                        <PrintInvoicesButton
                            invoices={[this.props.invoice]}
                            buttonTitle="Imprimir factura"
                            showIcon={true}
                            outputFilename={this.getOutputFilename()}
                            handleSuccessPrintInvoices={
                                this.props.handleSuccessPrintInvoices
                            }
                        />
                    </div>
                ) : null}
            </div>
        );
    }
}

export default ViewInvoiceSidebar;
