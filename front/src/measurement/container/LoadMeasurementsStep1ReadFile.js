import {useEffect, useState} from "react";
import {LoadDataValidatorService} from "validation";
import {LoadDataFileUpload} from "base/loaddata/fileupload";
import {MeasurementService} from "measurement/service";

const LoadMeasurementsStep1ReadFile = ({onValidateStep, onChangeMeasurements}) => {
    const [dataFiles, setDataFiles] = useState([]);

    useEffect(() => {
        onValidateStep(false);
    }, []);

    const handleLoadedDataFile = dataFile => {
        dataFile.errors = LoadDataValidatorService.validateMeasurementsFile(dataFile);
        setDataFiles(prevState => [...prevState, dataFile]);
        handleChangeMeasurements();
    };

    const handleRemoveDataFile = filename => {
        setDataFiles(prevState =>
            prevState.filter(dataFile => dataFile.file.name !== filename)
        );
        handleChangeMeasurements();
    };

    const handleChangeMeasurements = () => {
        const hasErrors = dataFiles.some(dataFile => dataFile.errors.length !== 0);
        if (!hasErrors) {
            const content = MeasurementService.mergeFileContents(
                dataFiles.map(dataFile => dataFile.content)
            );
            MeasurementService.getMeasurementsFromJSONContent(
                JSON.stringify(content)
            ).then(measurements => {
                onChangeMeasurements(measurements);
            });
        }
        onValidateStep(dataFiles.length !== 0 && !hasErrors);
    };

    const fileUpload = (
        <LoadDataFileUpload
            dataFiles={dataFiles}
            handleLoadedDataFile={handleLoadedDataFile}
            handleRemoveDataFile={handleRemoveDataFile}
            allowedFormats={[".json"]}
        />
    );

    return (
        <div className="col-12 row justify-content-center">
            <form className="col-md-8 p-3">{fileUpload}</form>
        </div>
    );
};

export default LoadMeasurementsStep1ReadFile;
