import React from "react";

class MemberDetailShort extends React.Component {
    get message() {
        if (!this.props.member.is_active) {
            return (
                <div className="alert alert-danger">
                    Este socio se encuentra eliminado del sistema.
                </div>
            );
        }
        return null;
    }

    render() {
        if (this.props.member) {
            const {
                num_socio,
                name,
                sector,
                comunidad,
                solo_mecha,
                consumo_maximo,
                consumo_reduccion_fija,
            } = this.props.member;
            return (
                <div className="row border rounded bg-light mb-3 p-1">
                    {this.message}
                    <div className="col-md-6">
                        <div className="field-label p-2 row no-gutters">
                            <label className="col-3">Nº socio</label>
                            <strong>{num_socio}</strong>
                        </div>
                        <div className="field-label p-2 row no-gutters">
                            <label className="col-3">Nombre</label>
                            <strong>{name}</strong>
                        </div>
                        <div className="field-label p-2 row no-gutters">
                            <label className="col-4">Tipo de socio</label>
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
                    </div>
                    <div className="col-md-6">
                        <div className="field-label p-2 row no-gutters">
                            <label className="col-5">Sector</label>
                            <span>
                                {sector} - {comunidad}
                            </span>
                        </div>
                        <div className="field-label p-2 row no-gutters">
                            <label className="col-6">Consumo máximo</label>
                            <span>{consumo_maximo}</span>
                        </div>
                        <div className="field-label p-2 row no-gutters">
                            <label className="col-6">Consumo red. fija</label>
                            <span>{consumo_reduccion_fija}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }
}

export default MemberDetailShort;
