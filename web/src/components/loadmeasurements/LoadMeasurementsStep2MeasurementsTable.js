import React from "react";
import ImportedDataTable from "../common/importeddata/table/ImportedDataTable";
import {ImportedDataValidatorService} from "service/validation";

class LoadMeasurementsStep2MeasurementsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            measurements: this.props.measurements,
            measurementsErrors: this.validateMeasurements(this.props.measurements),
        };
        console.log(this.state);
    }

    validateMeasurements(measurements) {
        return measurements
            .map(measurement =>
                ImportedDataValidatorService.validateMeasurementEntry(measurement)
            )
            .flat();
    }

    filterMeasurement(measurement, filterText) {
        return measurement.invoice.indexOf(filterText) >= 0;
    }

    isValid() {
        return (
            this.state.measurements != null &&
            this.state.measurementsErrors != null &&
            this.state.measurementsErrors.length === 0
        );
    }

    /* VIEW SUBCOMPONENTS */

    get messages() {
        if (this.state.measurementsErrors.length !== 0) {
            return (
                <div className="alert alert-danger" role="alert">
                    Se han encontrado errores en&nbsp;
                    <strong>{this.state.measurementsErrors.length}</strong> registros.
                </div>
            );
        }
        return (
            <div className="alert alert-success" role="alert">
                No se han encontrado errores.
            </div>
        );
    }

    get previousButton() {
        return (
            <button
                className="btn btn-secondary"
                type="button"
                onClick={this.props.prev}
            >
                <i className="fas fa-chevron-left"></i> Cargar nuevo fichero
            </button>
        );
    }

    get nextButton() {
        return (
            <button
                className="btn btn-primary float-right"
                type="button"
                onClick={this.props.next}
                disabled={!this.isValid()}
            >
                Actualizar facturas <i className="fas fa-chevron-right"></i>
            </button>
        );
    }

    render() {
        const headers = ["Sector", "Nº socio", "Fecha lectura", "Lectura actual"];
        const fields = [
            "sector",
            "memberNumber",
            "measurementDate",
            "currentMeasurement",
        ];
        return (
            <div className="column">
                <div className="col-12">
                    <ImportedDataTable
                        headers={headers}
                        fields={fields}
                        elements={this.state.measurements}
                        errors={this.state.measurementsErrors}
                        filterByText={this.filterMeasurement}
                    />
                </div>
                <div className="col-12">
                    {this.previousButton}
                    {this.nextButton}
                </div>
            </div>
        );
    }
}

export default LoadMeasurementsStep2MeasurementsTable;
