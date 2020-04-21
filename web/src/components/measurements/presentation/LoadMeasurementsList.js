import React from "react";
import {
    SortedTable,
    EditableTextCellTable,
    EditableSelectCellTable,
    LinkCellTable,
} from "components/common/table";

class LoadMeasurementsList extends React.Component {
    constructor(props) {
        super(props);
        this.handleClickViewMember = this.handleClickViewMember.bind(this);
    }

    handleClickViewMember(num_socio) {
        window.open("/socios/" + num_socio, "_blank");
    }

    render() {
        if (this.props.measurements) {
            const columns = [
                {
                    Header: "Número",
                    accessor: "num_socio",
                    Cell: LinkCellTable,
                    getProps: () => ({
                        handleClick: this.handleClickViewMember,
                        linkAccessor: "num_socio",
                    }),
                },
                {
                    Header: "Nombre",
                    accessor: "nombre_socio",
                    Cell: LinkCellTable,
                    getProps: () => ({
                        handleClick: this.handleClickViewMember,
                        linkAccessor: "num_socio",
                    }),
                },
                {
                    Header: "Sector",
                    accessor: "sector",
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
