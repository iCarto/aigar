import React from "react";
import InvoiceStatusLabel from "./InvoiceStatusLabel";

class MemberDetail extends React.Component {
    get message() {
        /*if (!this.props.invoice.is_active) {
            return (
                <div className="alert alert-danger">
                    Esta factura se encuentra eliminado del sistema.
                </div>
            );
        }*/
        return null;
    }

    render() {
        const {
            numero,
            estado,
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
            mora,
            total,
        } = this.props.invoice;
        return (
            <div className="card mb-3">
                {this.message}
                <div className="row">
                    <div className="col-6">
                        <div className="p-3">
                            <label className="p-1">Número:</label>
                            <span className="p-1">{numero}</span>
                        </div>
                        <div className="p-3">
                            <label className="p-1">Estado:</label>
                            <span className="p-1">
                                <InvoiceStatusLabel estado={estado} />
                            </span>
                        </div>
                        <div className="p-3">
                            <label className="p-1">Caudal anterior:</label>
                            <span className="p-1">{caudal_anterior}</span>
                        </div>
                        <div className="p-3">
                            <label className="p-1">Caudal actual:</label>
                            <span className="p-1">{caudal_actual}</span>
                        </div>
                        <div className="p-3">
                            <label className="p-1">Consumo:</label>
                            <span className="p-1">{consumo}</span>
                        </div>
                        <div className="p-3">
                            <label className="p-1">Cuota fija:</label>
                            <span className="p-1">{cuota_fija}</span>
                        </div>
                        <div className="p-3">
                            <label className="p-1">Cuota variable:</label>
                            <span className="p-1">{cuota_variable}</span>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="p-3">
                            <label className="p-1">Comision:</label>
                            <span className="p-1">{comision}</span>
                        </div>
                        <div className="p-3">
                            <label className="p-1">Ahorro:</label>
                            <span className="p-1">{ahorro}</span>
                        </div>
                        <div className="p-3">
                            <label className="p-1">Asamblea:</label>
                            <span className="p-1">{asamblea}</span>
                        </div>
                        <div className="p-3">
                            <label className="p-1">Derecho:</label>
                            <span className="p-1">{derecho}</span>
                        </div>
                        <div className="p-3">
                            <label className="p-1">Reconexión:</label>
                            <span className="p-1">{reconexion}</span>
                        </div>
                        <div className="p-3">
                            <label className="p-1">Mora:</label>
                            <span className="p-1">{mora}</span>
                        </div>
                        <div className="p-3">
                            <label className="p-1">Total:</label>
                            <span className="p-1">{total}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MemberDetail;
