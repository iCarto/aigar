import React from "react";
import {
    SortedTable,
    EditableSelectCellTable,
    EditableTextCellTable,
    EditableDateCellTable,
} from "components/common/table";
import {LoadDataTableFilter} from "components/common/loaddata/table";

class LoadPaymentsList extends React.Component {
    render() {
        if (this.props.payments) {
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
                    accessor: "nombre_socio",
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
