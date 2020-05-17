import React from "react";
import {MemberDetailShort} from "components/member/presentation";
import InvoiceDetailShort from "./InvoiceDetailShort";

class InvoiceDetail extends React.Component {
    render() {
        if (this.props.invoice) {
            const {
                consumo,
                caudal_actual,
                caudal_anterior,
                cuota_fija,
                cuota_variable,
                comision,
                ahorro,
                asamblea,
                derecho,
                reconexion,
                traspaso,
                otros,
                mora,
                saldo_pendiente,
                total,
            } = this.props.invoice;
            return (
                <div className="card p-2 mb-3">
                    <div className="row col-md-12">
                        <div className="col-md-8">
                            <MemberDetailShort member={this.props.member} />
                        </div>
                        <div className="col-md-4">
                            <InvoiceDetailShort
                                invoice={this.props.invoice}
                                payments={this.props.payments}
                            />
                        </div>
                    </div>
                    <div className="row m-3">
                        <div className="field-label p-2 col-md-2 row no-gutters"></div>
                        <div className="field-label p-2 col-md-3 row no-gutters">
                            <label className="col-6">Caudal anterior</label>
                            <span className="cubic-metre">{caudal_anterior}</span>
                        </div>
                        <div className="field-label p-2 col-md-3 row no-gutters">
                            <label className="col-6">Caudal actual</label>
                            <span className="cubic-metre">{caudal_actual}</span>
                        </div>
                        <div className="field-label p-2 col-md-3 row no-gutters">
                            <label className="col-6">Consumo</label>
                            <strong className="cubic-metre">{consumo}</strong>
                        </div>
                    </div>
                    <div className="row">
                        <div className="field-label p-2 col-md-4 offset-md-4 row">
                            <label className="col-8">Cuota fija</label>
                            <span className="col-2 dollar">{cuota_fija}</span>
                        </div>
                        <div className="field-label p-2 col-md-4 offset-md-4 row">
                            <label className="col-8">Cuota variable</label>
                            <span className="col-2 dollar">{cuota_variable}</span>
                        </div>
                        <div className="field-label p-2 col-md-4 offset-md-4 row">
                            <label className="col-8">Comisión de pago</label>
                            <span className="col-2 dollar">{comision}</span>
                        </div>
                        <div className="field-label p-2 col-md-4 offset-md-4 row">
                            <label className="col-8">Ahorro por mano de obra</label>
                            <span className="col-2 dollar">{ahorro}</span>
                        </div>
                        <div className="field-label p-2 col-md-4 offset-md-4 row">
                            <label className="col-8">Recargo por mora</label>
                            <span className="col-2 dollar">{mora}</span>
                        </div>
                        <div className="field-label p-2 col-md-4 offset-md-4 row">
                            <label className="col-8">Inasistencia a Asamblea</label>
                            <span className="col-2 dollar">{asamblea}</span>
                        </div>
                        <div className="field-label p-2 col-md-4 offset-md-4 row">
                            <label className="col-8">Nuevo derecho</label>
                            <span className="col-2 dollar">{derecho}</span>
                        </div>
                        <div className="field-label p-2 col-md-4 offset-md-4 row">
                            <label className="col-8">Re-conexión</label>
                            <span className="col-2 dollar">{reconexion}</span>
                        </div>
                        <div className="field-label p-2 col-md-4 offset-md-4 row">
                            <label className="col-8">Traspaso</label>
                            <span className="col-2 dollar">{traspaso}</span>
                        </div>
                        <div className="field-label p-2 col-md-4 offset-md-4 row">
                            <label className="col-8">Otros</label>
                            <span className="col-2 dollar">{otros}</span>
                        </div>
                        <div className="field-label p-2 col-md-4 offset-md-4 row">
                            <label className="col-8" style={{fontStyle: "italic"}}>
                                Saldo pendiente
                            </label>
                            <span className="col-2 dollar">{saldo_pendiente}</span>
                        </div>
                        <div
                            className="field-label p-2 col-md-4 offset-md-4 row"
                            style={{borderTop: "1px solid #ccc"}}
                        >
                            <label className="col-8">
                                <strong>Total</strong>
                            </label>
                            <strong className="col-2 dollar">{total}</strong>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }
}

export default InvoiceDetail;
