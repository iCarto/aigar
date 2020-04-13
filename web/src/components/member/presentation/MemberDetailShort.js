import React from "react";

class MemberDetailShort extends React.Component {
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
                <div className="card mb-3">
                    <div className="d-flex justify-content-center">
                        <div className="p-2">
                            <strong className="p-1">({num_socio})</strong>
                        </div>
                        <div className="p-2">
                            <strong className="p-1">{name}</strong>
                        </div>
                        <div className="p-2">
                            <span className="p-1">{sector + " - " + comunidad}</span>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center">
                        {solo_mecha ? (
                            <div className="p-2">
                                <label className="p-1">
                                    <strong>Solo mecha</strong>
                                </label>
                            </div>
                        ) : null}
                        <div className="p-2">
                            <label className="p-1">Consumo máximo:</label>
                            <span className="p-1">{consumo_maximo}</span>
                        </div>
                        <div className="p-2">
                            <label className="p-1">Consumo reducción fija:</label>
                            <span className="p-1">{consumo_reduccion_fija}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }
}

export default MemberDetailShort;
