import React from "react";
import {Spinner} from "components/common";
import {EditInvoice} from "components/invoice/container";
import {InvoiceNavigator} from "../presentation";

class EditMonthlyInvoice extends React.Component {
    render() {
        return (
            <div>
                <InvoiceNavigator
                    num_factura={this.props.num_factura}
                    num_facturas_list={this.props.num_facturas_list}
                    handleSelectInvoice={this.props.handleSelectInvoice}
                />
                <EditInvoice
                    num_factura={this.props.num_factura}
                    handleBack={this.props.handleBack}
                />
            </div>
        );
    }
}

export default EditMonthlyInvoice;
