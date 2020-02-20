import React from "react";

function UserTable() {
    return (
        <table className="table table-bordered table-hover">
            <thead className="thead-dark">
                <tr>
                    <th scope="col">Num Cadastro</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Consumo</th>
                    <th scope="col">Importe</th>
                    {/* El campo estado muestra en que momento temporal estamos: Se ha
                    facturado pero no se ha hecho la comprobación con el banco o se ha
                    facturado y se ha hecho ya la comprobación con el banco (Por ej:
                    Pendiente de cobro|Cobrado|Mora). */}
                    <th scope="col">Estado</th>
                    <th scope="col">Antepenultimo</th>
                    <th scope="col">Penultimo</th>
                    <th scope="col">Ultimo</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>@mdo</td>
                </tr>
                <tr className="table-active">
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    <td>@mdo</td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>Larry</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                    <td>@mdo</td>
                </tr>
                <tr>
                    <th scope="row">4</th>
                    <td>Foo</td>
                    <td className="bg-danger">Foo</td>
                    <td className="table-danger">@twitter</td>
                    <td>@mdo</td>
                </tr>
            </tbody>
        </table>
    );
}

export default UserTable;
