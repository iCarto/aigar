import React from "react";
import {SortedTable} from "components/common/table";
import {Spinner} from "components/common";

class InvoicesListPreview extends React.Component {
    render() {
        console.log("InvoicesListPreview.render");

        if (this.props.invoices) {
            const columns = [
                {
                    Header: "Sector",
                    accessor: "sector",
                },
                {
                    Header: "Nº socio",
                    accessor: "num_socio",
                },
                {
                    Header: "Nombre",
                    accessor: "nombre",
                },
                {
                    Header: "Número Factura",
                    accessor: "numero",
                },
                {
                    Header: "Lectura anterior",
                    accessor: "caudal_anterior",
                },
                {
                    Header: "Lectura actual",
                    accessor: "caudal_actual",
                },
                {
                    Header: "Consumo",
                    accessor: "consumo",
                },
                {
                    Header: "Cuota fija",
                    accessor: "cuota_fija",
                },
                {
                    Header: "Cuota variable",
                    accessor: "cuota_variable",
                },
                {
                    Header: "Total",
                    accessor: "total",
                },
            ];

            return (
                <div
                    className="overflow-auto border rounded"
                    style={{maxHeight: "450px"}}
                >
                    <SortedTable columns={columns} data={this.props.invoices} />
                </div>
            );
        }
        return <Spinner message="Obteniendo facturas" />;
    }
}

export default InvoicesListPreview;
