import {useEffect, useState} from "react";
import {LoadDataValidatorService} from "validation/service";
import {MeasurementService} from "measurement/service";
import {LoadDataFileUploadArea} from "loaddata/presentational";
import Grid from "@mui/material/Grid";

const LoadMeasurementsStep1ReadFile = ({onValidateStep, onChangeMeasurements}) => {
    const [dataFiles, setDataFiles] = useState([]);

    useEffect(() => {
        onValidateStep(false);
    }, []);

    const handleLoadedDataFile = dataFile => {
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
            MeasurementService.getMeasurementsFromJSONContent(
                JSON.stringify(content)
            ).then(measurements => {
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

export default LoadMeasurementsStep1ReadFile;
