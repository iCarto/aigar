import React from "react";

class MemberInvoices extends React.Component {
    render() {
        return (
            <table className="table table-bordered table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Factura</th>
                        <th scope="col">Valor</th>
                        <th scope="col">Pago</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1111</td>
                        <td>222</td>
                        <td>333</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default MemberInvoices;
