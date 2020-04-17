import React from "react";
import {
    SortedTable,
    EditableTextCellTable,
    EditableDateCellTable,
} from "components/common/table";

class LoadPaymentsList extends React.Component {
    render() {
        if (this.props.payments) {
            const columns = [
                {
                    Header: "Nº socio",
                    accessor: "num_socio",
                },
                {
                    Header: "Nombre",
                    accessor: "nombre_socio",
                },
                {
                    Header: "Sector",
                    accessor: "sector",
                },
                {
                    Header: "Nº Factura",
                    accessor: "num_factura",
                    Cell: EditableTextCellTable,
                },
                {
                    Header: "Fecha",
                    accessor: "fecha",
                    Cell: EditableDateCellTable,
                },
                {
                    Header: "Monto",
                    accessor: "monto",
                    Cell: EditableTextCellTable,
                },
            ];

            return (
                <div
                    className="overflow-auto border rounded"
                    style={{maxHeight: "450px"}}
                >
                    <SortedTable
                        columns={columns}
                        data={this.props.payments}
                        onUpdateData={this.props.onUpdatePayment}
                    />
                </div>
            );
        }
        return null;
    }
}

export default LoadPaymentsList;
