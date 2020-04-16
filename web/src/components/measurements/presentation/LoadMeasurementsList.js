import React from "react";
import {
    SortedTable,
    EditableTextCellTable,
    EditableSelectCellTable,
} from "components/common/table";

class LoadMeasurementsList extends React.Component {
    render() {
        if (this.props.measurements) {
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
                    Header: "Medidor",
                    accessor: "medidor",
                    Cell: EditableTextCellTable,
                },
                {
                    Header: "Cambio medidor",
                    accessor: "cambio_medidor",
                    Cell: EditableSelectCellTable,
                },
                {
                    Header: "Lectura anterior",
                    accessor: "caudal_anterior",
                    Cell: EditableTextCellTable,
                },
                {
                    Header: "Lectura actual",
                    accessor: "caudal_actual",
                    Cell: EditableTextCellTable,
                },
                {
                    Header: "Consumo",
                    accessor: "consumo",
                },
            ];

            return (
                <div
                    className="overflow-auto border rounded"
                    style={{maxHeight: "450px"}}
                >
                    <SortedTable
                        columns={columns}
                        data={this.props.measurements}
                        onUpdateData={this.props.onUpdateMeasurement}
                    />
                </div>
            );
        }
        return null;
    }
}

export default LoadMeasurementsList;
