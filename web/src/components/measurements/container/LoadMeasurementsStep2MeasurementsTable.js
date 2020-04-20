import React from "react";
import {LoadDataValidatorService} from "service/validation";
import {createMeasurement} from "model";
import {Spinner} from "components/common";
import {LoadMeasurementsList} from "../presentation";
import {LoadDataTableFilter} from "components/common/loaddata/table";

class LoadMeasurementsStep2MeasurementsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {
                text: "",
                props: false,
            },
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.onUpdateMeasurement = this.onUpdateMeasurement.bind(this);
    }

    getMeasurementsTotalErrors(measurements) {
        return measurements.filter(measurement => measurement.errors.length !== 0)
            .length;
    }

    componentDidMount() {
        this.reviewMeasurements(this.props.measurements);
    }

    reviewMeasurements(measurements) {
        const measurementsWithErrors = measurements.map(measurement => {
            return createMeasurement({
                ...measurement,
                errors: LoadDataValidatorService.validateMeasurementEntry(measurement),
            });
        });
        this.props.handleChangeMeasurements(measurementsWithErrors);
        this.props.setIsValidStep(
            this.getMeasurementsTotalErrors(measurementsWithErrors) === 0
        );
    }

    handleFilterChange(newFilter) {
        this.setState({
            filter: Object.assign(this.state.filter, newFilter),
        });
    }

    filterByText(measurement, filterText) {
        return (
            measurement.nombre_socio.toLowerCase().indexOf(filterText.toLowerCase()) >=
                0 ||
            measurement.num_socio.toString().indexOf(filterText) >= 0 ||
            measurement.medidor.toString().indexOf(filterText) >= 0
        );
    }

    filter(measurements) {
        return measurements.filter(measurement => {
            let filtered = true;
            if (this.state.filter.text != null && this.state.filter.text !== "") {
                filtered = this.filterByText(measurement, this.state.filter.text);
            }
            if (this.state.filter.showOnlyErrors === "true") {
                filtered = filtered && measurement.errors.length !== 0;
            }
            return filtered;
        });
    }

    onUpdateMeasurement(rowId, columnId, value) {
        const updatedMeasurements = this.props.measurements.map(
            (measurement, index) => {
                if (measurement.id === rowId) {
                    const updatedMeasurement = createMeasurement({
                        ...this.props.measurements[index],
                        [columnId]: value,
                    });
                    return updatedMeasurement;
                }
                return measurement;
            }
        );
        this.reviewMeasurements(updatedMeasurements);
    }

    /* VIEW SUBCOMPONENTS */

    get messagesError() {
        const totalRegistersWithErrors = this.getMeasurementsTotalErrors(
            this.props.measurements
        );
        if (totalRegistersWithErrors !== 0) {
            return (
                <div className="alert alert-danger text-center" role="alert">
                    Existen <strong>{totalRegistersWithErrors}</strong> registros con
                    error de un total de{" "}
                    <strong>{this.props.measurements.length}</strong> registros leídos.
                </div>
            );
        }
        return null;
    }

    render() {
        const measurementsFiltered = this.filter(this.props.measurements);
        if (this.props.measurements) {
            return (
                <div className="d-flex flex-column justify-content-around">
                    {this.messagesError}
                    <LoadDataTableFilter
                        filter={this.state.filter}
                        handleChange={this.handleFilterChange}
                    />
                    <LoadMeasurementsList
                        measurements={measurementsFiltered}
                        handleFilterChange={this.handleFilterChange}
                        onUpdateMeasurement={this.onUpdateMeasurement}
                    />
                </div>
            );
        }
        return <Spinner message="Cargando lecturas" />;
    }
}

export default LoadMeasurementsStep2MeasurementsTable;
