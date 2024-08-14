import {useEffect, useState} from "react";
import {LoadDataValidatorService} from "validation/service";
import {MeasurementService} from "measurement/service";
import {LoadDataFileUploadArea} from "loaddata/presentational";
import Grid from "@mui/material/Grid";
import {useDomain} from "aigar/domain/provider";

export const LoadMeasurementsStep1ReadFile = ({
    onValidateStep,
    onChangeMeasurements,
}) => {
    const [dataFiles, setDataFiles] = useState([]);

    const {sectors} = useDomain();

    useEffect(() => {
        onValidateStep(false);
    }, []);

    const adaptDataFileFromV1 = dataFile => {
        const content = JSON.parse(dataFile.content);
        const members = content.members || content;
        const newContent = members.map(r => {
            const sector = sectors.find(element =>
                element.key.startsWith(r.sector)
            ).key;
            const newRow = {
                member_name: r.name,
                orden: r.orden,
                sector: sector,
                caudal_anterior: r.caudal_anterior,
                caudal_anterior_org: r.caudal_anterior_org,
                caudal_actual: r.caudal_actual,
                medidor: r.medidor,
                cambio_medidor: r.cambio_medidor,
                member_id: r.id,
            };
            return newRow;
        });
        dataFile.content = JSON.stringify(newContent);
    };

    const handleLoadedDataFile = dataFile => {
        adaptDataFileFromV1(dataFile);
        dataFile.errors = LoadDataValidatorService.validateMeasurementsFile(dataFile);
        setDataFiles(prevDataFiles => {
            const updatedDataFiles = [...prevDataFiles, dataFile];
            handleChangeMeasurements(updatedDataFiles);
            return updatedDataFiles;
        });
    };

    const handleRemoveDataFile = filename => {
        setDataFiles(prevDataFiles => {
            const updatedDataFiles = prevDataFiles.filter(
                dataFile => dataFile.file.name !== filename
            );
            handleChangeMeasurements(updatedDataFiles);
            return updatedDataFiles;
        });
    };

    const handleChangeMeasurements = updatedDataFiles => {
        const hasErrors = updatedDataFiles.some(
            dataFile => dataFile.errors.length !== 0
        );
        if (!hasErrors) {
            const content = MeasurementService.mergeFileContents(
                updatedDataFiles.map(dataFile => dataFile.content)
            );
            MeasurementService.getMeasurements(content).then(measurements => {
                onChangeMeasurements(measurements);
            });
        }
        onValidateStep(updatedDataFiles.length !== 0 && !hasErrors);
    };

    return (
        <Grid container justifyContent="center">
            <Grid item xs={8} p={3}>
                <LoadDataFileUploadArea
                    dataFiles={dataFiles}
                    handleLoadedDataFile={handleLoadedDataFile}
                    handleRemoveDataFile={handleRemoveDataFile}
                    allowedFormats={[".json"]}
                />
            </Grid>
        </Grid>
    );
};
