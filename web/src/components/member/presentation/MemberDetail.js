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
                <div className="row">
                    <div className="col-6">
                        <div className="p-3">
                            <label className="p-1">Número de socio:</label>
                            <span className="p-1">{num_socio}</span>
                        </div>
                        <div className="p-3">
                            <label className="p-1">Nombre:</label>
                            <span className="p-1">{name}</span>
                        </div>
                        <div className="p-3">
                            <label className="p-1">Sector:</label>
                            <span className="p-1">{sector}</span>
                        </div>
                        <div className="p-3">
                            <label className="p-1">Comunidad:</label>
                            <span className="p-1">{comunidad}</span>
                        </div>
                        <div className="p-3">
                            <label className="p-1">Orden:</label>
                            <span className="p-1">{orden}</span>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="p-3">
                            <label className="p-1">Medidor:</label>
                            <span className="p-1">{medidor}</span>
                        </div>
                        <div className="p-3">
                            <label className="p-1">
                                {solo_mecha ? <strong>Solo mecha</strong> : null}
                            </label>
                        </div>
                        <div className="p-3">
                            <label className="p-1">Consumo máximo:</label>
                            <span className="p-1">{consumo_maximo}</span>
                        </div>
                        <div className="p-3">
                            <label className="p-1">Consumo reducción fija:</label>
                            <span className="p-1">{consumo_reduccion_fija}</span>
                        </div>
                        <div className="p-3">
                            <label className="p-1">Observaciones:</label>
                            <span className="p-1">{observaciones}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MemberDetail;
