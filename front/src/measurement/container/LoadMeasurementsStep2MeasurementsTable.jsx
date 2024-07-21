import {useEffect, useState} from "react";
import {useFilterMonthlyData} from "monthlyinvoicing/hooks";
import {LoadDataValidatorService} from "validation/service";
import {createMeasurement} from "measurement/model";
import {useLoadMeasurementsTableColumns} from "measurement/data";

import {MemberViewModal} from "member/presentational";
import {LoadDataTable, LoadDataTableFilter} from "loaddata/presentational";
import {ErrorMessage} from "base/error/components";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const LoadMeasurementsStep2MeasurementsTable = ({
    measurements,
    onChangeMeasurements,
    onValidateStep,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMemberForModal, setSelectedMemberForModal] = useState(null);
    const [filter, setFilter] = useState({
        textSearch: "",
        showOnlyErrors: false,
    });

    const {filterMonthlyData} = useFilterMonthlyData();

    useEffect(() => {
        onValidateStep(false);
        reviewMeasurements(measurements);
    }, []);

    const handleClickViewMember = member_id => {
        setIsModalOpen(true);
        setSelectedMemberForModal(member_id);
    };

    const onClickCancelViewMember = () => {
        setIsModalOpen(false);
        setSelectedMemberForModal(null);
    };

    const {tableColumns} = useLoadMeasurementsTableColumns(handleClickViewMember);

    const modal = (
        <MemberViewModal
            id={selectedMemberForModal}
            isOpen={isModalOpen}
            onClose={onClickCancelViewMember}
        />
    );

    const handleUpdateMeasurement = (row, columnId, value) => {
        const updatedMeasurements = measurements.map((measurement, index) => {
            if (measurement.id === row.original.id) {
                const updatedMeasurement = createMeasurement({
                    ...measurement,
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

    const totalRegistersWithErrors = getTotalErrors(measurements);

    const errorsMessage = (
        <Typography>
            Existen <strong>{totalRegistersWithErrors}</strong> registros con error de
            un total de <strong>{measurements.length}</strong> registros leídos.
        </Typography>
    );

    const filteredMeasurements = filterMonthlyData(measurements, filter);

    return (
        <Grid>
            {totalRegistersWithErrors ? <ErrorMessage message={errorsMessage} /> : null}
            <LoadDataTableFilter filter={filter} onChange={handleFilterChange} />
            <LoadDataTable
                items={filteredMeasurements}
                columns={tableColumns}
                onUpdateData={handleUpdateMeasurement}
            />
            {modal}
        </Grid>
    );
};

export default LoadMeasurementsStep2MeasurementsTable;
