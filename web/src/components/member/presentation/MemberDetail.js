import React from "react";
import {Link} from "react-router-dom";

class MemberDetail extends React.Component {
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
                        <div className="p-3">
                            <Link to={"/socios/" + num_socio + "/modificar"}>
                                <button
                                    className="btn btn-primary center"
                                    type="button"
                                >
                                    Cambiar datos <i className="fas fa-edit"></i>
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="p-3">
                            <label className="p-1">Medidor:</label>
                            <span className="p-1">{medidor}</span>
                        </div>
                        <div className="p-3">
                            <label className="p-1">Solo mecha:</label>
                            <span className="p-1">{solo_mecha}</span>
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
