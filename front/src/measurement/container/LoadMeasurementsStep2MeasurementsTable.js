import {useEffect, useState} from "react";
import {LoadDataValidatorService} from "validation";
import {LoadMeasurementsList} from "../presentational";
import {LoadDataTableFilter} from "base/loaddata/table";
import {createMeasurement} from "measurement/model";

const LoadMeasurementsStep2MeasurementsTable = ({
    measurements,
    onValidateStep,
    onChangeMeasurements,
}) => {
    const [filter, setFilter] = useState({
        text: "",
        props: false,
    });

    const getMeasurementsTotalErrors = measurements => {
        return measurements.filter(measurement => measurement.errors.length !== 0)
            .length;
    };

    useEffect(() => {
        reviewMeasurements(measurements);
    }, [measurements]);

    const reviewMeasurements = measurements => {
        const measurementsWithErrors = measurements.map(measurement => {
            return createMeasurement({
                ...measurement,
                errors: LoadDataValidatorService.validateMeasurementEntry(measurement),
            });
        });
        onChangeMeasurements(measurementsWithErrors);
        onValidateStep(getMeasurementsTotalErrors(measurementsWithErrors) === 0);
    };

    const handleFilterChange = newFilter => {
        setFilter(prevState => ({...prevState, ...newFilter}));
    };

    const filterByText = (measurement, filterText) => {
        return (
            measurement.nombre_socio.toLowerCase().indexOf(filterText.toLowerCase()) >=
                0 ||
            measurement.num_socio.toString().indexOf(filterText) >= 0 ||
            measurement.medidor.toString().indexOf(filterText) >= 0
        );
    };

    const filterMeasurements = measurements => {
        return measurements.filter(measurement => {
            let filtered = true;
            if (filter.text != null && filter.text !== "") {
                filtered = filterByText(measurement, filter.text);
            }
            if (filter.showOnlyErrors === "true") {
                filtered = filtered && measurement.errors.length !== 0;
            }
            return filtered;
        });
    };

    const onUpdateMeasurement = (rowId, columnId, value) => {
        const updatedMeasurements = measurements.map((measurement, index) => {
            if (measurement.id === rowId) {
                const updatedMeasurement = createMeasurement({
                    ...measurements[index],
                    [columnId]: value,
                });
                return updatedMeasurement;
            }
            return measurement;
        });
        reviewMeasurements(updatedMeasurements);
    };

    const messagesError = () => {
        const totalRegistersWithErrors = getMeasurementsTotalErrors(measurements);
        if (totalRegistersWithErrors !== 0) {
            return (
                <div className="alert alert-danger text-center" role="alert">
                    Existen <strong>{totalRegistersWithErrors}</strong> registros con
                    error de un total de <strong>{measurements.length}</strong>{" "}
                    registros leídos.
                </div>
            );
        }
        return null;
    };

    const measurementsFiltered = filterMeasurements(measurements);

    return (
        <div className="d-flex flex-column justify-content-around">
            {messagesError()}
            <LoadDataTableFilter filter={filter} handleChange={handleFilterChange} />
            <LoadMeasurementsList
                measurements={measurementsFiltered}
                handleFilterChange={handleFilterChange}
                onUpdateMeasurement={onUpdateMeasurement}
            />
        </div>
    );
};

export default LoadMeasurementsStep2MeasurementsTable;
