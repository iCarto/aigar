import React from "react";

class MemberDetail extends React.Component {
    get message() {
        if (!this.props.member.is_active) {
            return (
                <div className="alert alert-danger">
                    Este usuario se encuentra eliminado del sistema.
                </div>
            );
        }
        return null;
    }

    render() {
        if (this.props.member) {
            const {
                num_socio,
                observaciones,
                name,
                sector,
                medidor,
                solo_mecha,
                orden,
                consumo_maximo,
                consumo_reduccion_fija,
                comunidad,
            } = this.props.member;
            return (
                <div className="card mb-3">
                    {this.message}
                    <div className="row p-3">
                        <div className="col-md-5 offset-md-1">
                            <div className="field-label p-2 row no-gutters">
                                <label className="col-5">Nº socio</label>
                                <strong>{num_socio}</strong>
                            </div>
                            <div className="field-label p-2 row no-gutters">
                                <label className="col-5">Nombre</label>
                                <strong>{name}</strong>
                            </div>
                            <div className="field-label p-2 row no-gutters">
                                <label className="col-5">Tipo de socio</label>
                                {solo_mecha ? (
                                    <strong>
                                        <i className="fas fa-tint-slash mr-2" />
                                        Solo mecha
                                    </strong>
                                ) : (
                                    <strong>
                                        <i className="fas fa-tint mr-2" />
                                        Conectado
                                    </strong>
                                )}
                            </div>
                            <div className="field-label p-2 row no-gutters">
                                <label className="col-5">Sector</label>
                                <span>
                                    {sector} - {comunidad}
                                </span>
                            </div>
                            <div className="field-label p-2 row no-gutters">
                                <label className="col-5">Observaciones</label>
                                <span className="col-7">{observaciones}</span>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="field-label p-2 row no-gutters">
                                <label className="col-6">Orden</label>
                                <span>{orden}</span>
                            </div>
                            <div className="field-label p-2 row no-gutters">
                                <label className="col-6">Medidor</label>
                                <span>{medidor}</span>
                            </div>
                            <div className="field-label p-2 row no-gutters">
                                <label className="col-6">Consumo máximo</label>
                                <span>{consumo_maximo}</span>
                            </div>
                            <div className="field-label p-2 row no-gutters">
                                <label className="col-6">Consumo reducción fija</label>
                                <span>{consumo_reduccion_fija}</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }
}

export default MemberDetail;
