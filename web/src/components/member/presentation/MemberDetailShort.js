import React from "react";

class MemberDetailShort extends React.Component {
    render() {
        if (this.props.member) {
            const {num_socio, name, comunidad} = this.props.member;
            return (
                <div className="card mb-3">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="p-3">
                                <label className="p-1">Número de socio:</label>
                                <span className="p-1">{num_socio}</span>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-3">
                                <label className="p-1">Nombre:</label>
                                <span className="p-1">{name}</span>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-3">
                                <label className="p-1">Comunidad:</label>
                                <span className="p-1">{comunidad}</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }
}

export default MemberDetailShort;
