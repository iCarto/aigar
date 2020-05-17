import React from "react";
import {DateUtil} from "utilities";
import InvoiceStatusLabel from "./InvoiceStatusLabel";

class InvoiceDetailShort extends React.Component {
    get message() {
        if (!this.props.invoice.is_active) {
            return (
                <div className="alert alert-danger">La factura ha sido anulada.</div>
            );
        }
        return null;
    }

    render() {
        if (this.props.invoice) {
            const {numero, mes_facturado, anho, estado} = this.props.invoice;
            return (
                <div className="border rounded bg-light mb-3 p-1">
                    {this.message}
                    <div className="field-label p-2 row no-gutters">
                        <label className="col-md-5">Recibo nº</label>
                        <strong>{numero}</strong>
                    </div>
                    <div className="field-label p-2 row no-gutters">
                        <label className="col-md-5">Mes de cobro</label>
                        <strong>
                            {DateUtil.getMonthName(mes_facturado)} - {anho}
                        </strong>
                    </div>
                    <div className="field-label p-2 row no-gutters">
                        <label className="col-md-5">Estado</label>
                        <span>
                            <InvoiceStatusLabel estado={estado} />
                        </span>
                    </div>
                    {this.props.payments && this.props.payments.length !== 0 ? (
                        <div className="field-label p-2 row no-gutters">
                            <label className="col-md-5">Pago</label>
                            <span>
                                {this.props.payments.map(payment => {
                                    return (
                                        <div key={payment.id}>
                                            {payment.fecha} -{" "}
                                            <span class="dollar">{payment.monto}</span>
                                        </div>
                                    );
                                })}
                            </span>
                        </div>
                    ) : null}
                </div>
            );
        }
        return null;
    }
}

export default InvoiceDetailShort;
