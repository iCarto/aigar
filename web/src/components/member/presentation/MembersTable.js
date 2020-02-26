import React from "react";
import {Link} from "react-router-dom";

class MembersTable extends React.Component {
    render() {
        if (this.props.members) {
            return (
                <table className="table table-bordered table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Número</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Sector / Comunidad</th>
                            <th scope="col">Medidor</th>
                            <th scope="col">Mecha</th>
                            <th scope="col">Orden</th>
                            <th scope="col">Consumo Máximo</th>
                            <th scope="col">Consumo Reducción Fija</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.members.map(member => (
                            <tr key={member.num_socio}>
                                <td>{member.num_socio}</td>
                                <td>
                                    <Link to={`/socios/${member.num_socio}`}>
                                        {member.name}
                                    </Link>
                                </td>
                                <td>
                                    {member.sector} / {member.comunidad}
                                </td>
                                <td>{member.medidor}</td>
                                <td>{member.solo_mecha}</td>
                                <td>{member.orden}</td>
                                <td>{member.consumo_maximo}</td>
                                <td>{member.consumo_reduccion_fija}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }
    }
}

export default MembersTable;
