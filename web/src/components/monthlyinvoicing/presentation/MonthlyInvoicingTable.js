import React from "react";

class MonthlyInvoicingTable extends React.Component {
    render() {
        if (this.props.membersMonthInfo) {
            return (
                <table className="table table-bordered table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Usuario</th>
                            <th scope="col">Sector</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">Lectura</th>
                            <th scope="col">Importe</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Mora</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.membersMonthInfo.map(memberMonthInfo => (
                            <tr key={memberMonthInfo.num_socio}>
                                <td>
                                    <button
                                        type="button"
                                        className="link-button text-primary"
                                        onClick={() =>
                                            this.props.handleSelectMember(
                                                memberMonthInfo.num_socio
                                            )
                                        }
                                    >
                                        {memberMonthInfo.nombre_socio}
                                    </button>
                                </td>
                                <td>{memberMonthInfo.sector_socio}</td>
                                <td>{memberMonthInfo.tipo_socio}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="link-button text-primary"
                                        onClick={() =>
                                            this.props.handleSelectInvoice(
                                                memberMonthInfo.num_factura
                                            )
                                        }
                                    >
                                        {memberMonthInfo.lectura}
                                    </button>
                                </td>
                                <td>{memberMonthInfo.importe}</td>
                                <td>{memberMonthInfo.estado}</td>
                                <td>{memberMonthInfo.mora}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }
        return null;
    }
}

export default MonthlyInvoicingTable;
