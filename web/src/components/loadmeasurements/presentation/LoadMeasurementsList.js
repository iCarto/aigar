import React from "react";
import {
    SortedTable,
    EditableSelectCellTable,
    EditableTextCellTable,
} from "components/common/table";
import {LoadDataTableFilter} from "components/common/loaddata/table";

class LoadMeasurementsList extends React.Component {
    render() {
        console.log("LoadMeasurementsList.render");

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
                    Header: "Lectura anterior",
                    accessor: "lectura_anterior",
                    Cell: EditableTextCellTable,
                },
                {
                    Header: "Lectura actual",
                    accessor: "lectura",
                    Cell: EditableTextCellTable,
                },
                {
                    Header: "Nº contador",
                    accessor: "num_contador",
                    Cell: EditableTextCellTable,
                },
                {
                    Header: "Cambio de contador",
                    accessor: "cambio_contador",
                    Cell: EditableSelectCellTable,
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
