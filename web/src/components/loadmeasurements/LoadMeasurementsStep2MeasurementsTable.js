import React from "react";
import {LoadDataValidatorService} from "service/validation";
import {
    SortedTable,
    EditableTextCellTable,
    EditableSelectCellTable,
} from "components/common/table";
import {createMeasurement} from "model";
import {Spinner} from "components/common";
import LoadDataTableFilter from "components/common/loaddata/table/LoadDataTableFilter";

class LoadMeasurementsStep2MeasurementsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            measurements: null,
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.updateMyData = this.updateMyData.bind(this);
    }

    componentDidMount() {
        this.setState(
            {
                measurements: this.props.measurements,
            },
            () => {
                this.props.setIsPreviousButtonEnabled(true);
                this.props.setIsNextButtonEnabled(this.isNextButtonEnabled());
            }
        );
    }

    getMeasurementsTotalErrors() {
        return this.state.measurements.filter(
            measurement => measurement.errors.length !== 0
        ).length;
    }

    filterByText(measurement, filterText) {
        return (
            measurement.nombre_socio.indexOf(filterText) >= 0 ||
            measurement.num_socio.toString().indexOf(filterText) >= 0 ||
            measurement.num_contador.toString().indexOf(filterText) >= 0
        );
    }

    handleFilterChange(filterData) {
        this.setState((prevState, props) => ({
            measurements: props.measurements.filter(measurement => {
                let filtered = true;
                if (filterData.filterText != null) {
                    filtered = this.filterByText(measurement, filterData.filterText);
                }
                if (filterData.showOnlyErrors) {
                    filtered = filtered && measurement.errors.length !== 0;
                }
                return filtered;
            }),
        }));
    }

    isNextButtonEnabled() {
        return (
            this.state.measurements != null && this.getMeasurementsTotalErrors() === 0
        );
    }

    updateMyData(rowIndex, columnId, value) {
        // We also turn on the flag to not reset the page
        console.log({rowIndex}, {columnId}, {value});
        this.setState(
            (prevState, props) => {
                const updatedMeasurements = prevState.measurements.map((row, index) => {
                    if (index === rowIndex) {
                        const updatedMeasurementData = {
                            ...prevState.measurements[rowIndex],
                            [columnId]: value,
                        };
                        const updatedMeasurement = createMeasurement({
                            ...updatedMeasurementData,
                            errors: LoadDataValidatorService.validateMeasurementEntry(
                                updatedMeasurementData
                            ),
                        });
                        console.log({updatedMeasurement});
                        return updatedMeasurement;
                    }
                    return row;
                });
                return {measurements: updatedMeasurements};
            },
            () => {
                this.props.setIsNextButtonEnabled(this.isNextButtonEnabled());
                this.props.handleChangeData(this.state.measurements);
            }
        );
    }

    /* VIEW SUBCOMPONENTS */

    get messages() {
        if (!this.state.measurements || this.state.measurements.length === 0) {
            return (
                <div className="alert alert-warning text-center" role="alert">
                    No existen registros.
                </div>
            );
        }
        const totalRegistersWithErrors = this.getMeasurementsTotalErrors();
        if (totalRegistersWithErrors !== 0) {
            return (
                <div className="alert alert-danger text-center" role="alert">
                    Existen <strong>{totalRegistersWithErrors}</strong> registros con
                    error de un total de{" "}
                    <strong>{this.state.measurements.length}</strong> registros leídos.
                </div>
            );
        }
        return (
            <div className="alert alert-success text-center" role="alert">
                No existen errores.
            </div>
        );
    }

    get filter() {
        return <LoadDataTableFilter handleFilterChange={this.handleFilterChange} />;
    }

    render() {
        if (this.state.measurements) {
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
                <div className="d-flex flex-column justify-content-around">
                    {this.messages}
                    {this.filter}
                    <div
                        className="overflow-auto border rounded"
                        style={{maxHeight: "450px"}}
                    >
                        <SortedTable
                            columns={columns}
                            data={this.state.measurements}
                            updateMyData={this.updateMyData}
                        />
                    </div>
                </div>
            );
        }
        return <Spinner message="Cargando lecturas" />;
    }
}

export default LoadMeasurementsStep2MeasurementsTable;
