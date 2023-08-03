import {useEffect, useState} from "react";
import {useFilterMonthlyData} from "monthlyinvoicing/hooks";
import {LoadDataValidatorService} from "validation/service";
import {createMeasurement} from "measurement/model";
import {LoadMeasurementsList} from "../presentational";
import {LoadDataTableFilter} from "loaddata/presentational";

const LoadMeasurementsStep2MeasurementsTable = ({
    measurements,
    onChangeMeasurements,
    onValidateStep,
}) => {
    const [filter, setFilter] = useState({
        text: "",
        showOnlyErrors: false,
    });

    const {filterMonthlyData} = useFilterMonthlyData();

    useEffect(() => {
        reviewMeasurements(measurements);
    }, []);

    const handleUpdateMeasurement = (rowId, columnId, value) => {
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

    const getTotalErrors = measurements => {
        return measurements.filter(measurement => measurement.errors.length !== 0)
            .length;
    };

    const reviewMeasurements = measurements => {
        const measurementsWithErrors = measurements.map(measurement => {
            return createMeasurement({
                ...measurement,
                errors: LoadDataValidatorService.validateMeasurementEntry(measurement),
            });
        });
        onChangeMeasurements(measurementsWithErrors);
        onValidateStep(getTotalErrors(measurementsWithErrors) === 0);
    };

    const handleFilterChange = newFilter => {
        setFilter(prevState => ({...prevState, ...newFilter}));
    };

    const getErrorMessages = () => {
        const totalRegistersWithErrors = getTotalErrors(measurements);
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

    const filteredMeasurements = filterMonthlyData(measurements, filter);

    return (
        <div className="d-flex flex-column justify-content-around">
            {getErrorMessages()}
            <LoadDataTableFilter filter={filter} onChange={handleFilterChange} />
            <LoadMeasurementsList
                measurements={filteredMeasurements}
                onUpdateMeasurement={handleUpdateMeasurement}
            />
        </div>
    );
};

export default LoadMeasurementsStep2MeasurementsTable;
