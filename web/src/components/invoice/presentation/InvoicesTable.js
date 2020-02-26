import React from "react";
import {Link} from "react-router-dom";

class InvoicesTable extends React.Component {
    render() {
        if (this.props.invoices) {
            return (
                <table className="table table-bordered table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Número</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Sector / Comunidad</th>
                            <th scope="col">Consumo</th>
                            <th scope="col">Caudal actual</th>
                            <th scope="col">Caudal anterior</th>
                            <th scope="col">Cuota fija</th>
                            <th scope="col">Comisión</th>
                            <th scope="col">Ahorro</th>
                            <th scope="col">Derecho</th>
                            <th scope="col">Reconexion</th>
                            <th scope="col">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.invoices.map(invoice => (
                            <tr key={invoice.numero}>
                                <td>
                                    <Link to={`/factura/${invoice.numero}`}>
                                        {invoice.numero}
                                    </Link>
                                </td>
                                <td>{invoice.nombre}</td>
                                <td>
                                    {invoice.sector} / {invoice.comunidad}
                                </td>
                                <td>{invoice.consumo}</td>
                                <td>{invoice.caudal_actual}</td>
                                <td>{invoice.caudal_anterior}</td>
                                <td>{invoice.cuota_fija}</td>
                                <td>{invoice.comision}</td>
                                <td>{invoice.ahorro}</td>
                                <td>{invoice.derecho}</td>
                                <td>{invoice.reconexion}</td>
                                <td>{invoice.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }
    }
}

export default InvoicesTable;
