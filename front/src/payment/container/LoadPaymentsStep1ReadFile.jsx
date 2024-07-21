import {useState, useEffect} from "react";
import {PaymentService} from "payment/service";
import {LoadDataValidatorService} from "validation/service";
import {LoadDataFileUploadArea} from "loaddata/presentational";
import Grid from "@mui/material/Grid";

const LoadPaymentsStep1ReadFile = ({onValidateStep, onChangePayments}) => {
    const [dataFiles, setDataFiles] = useState([]);

    useEffect(() => {
        onValidateStep(false);
    }, []);

    const handleLoadedDataFile = dataFile => {
        dataFile.errors = LoadDataValidatorService.validatePaymentsFile(dataFile);
        setDataFiles(prevDataFiles => {
            const updatedDataFiles = [...prevDataFiles, dataFile];
            handleChangePayments(updatedDataFiles);
            return updatedDataFiles;
        });
    };

    const handleRemoveDataFile = filename => {
        setDataFiles(prevDataFiles => {
            const updatedDataFiles = prevDataFiles.filter(
                dataFile => dataFile.file.name !== filename
            );
            handleChangePayments(updatedDataFiles);
            return updatedDataFiles;
        });
    };

    const handleChangePayments = updatedDataFiles => {
        const hasErrors = updatedDataFiles.some(
            dataFile => dataFile.errors.length !== 0
        );
        if (!hasErrors) {
            const content = PaymentService.mergeFileContents(
                updatedDataFiles.map(dataFile => dataFile.content)
            );
            PaymentService.getPaymentsFromCSVContent(content).then(payments => {
                onChangePayments(payments);
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
                    allowedFormats={[".csv", ".txt"]}
                />
            </Grid>
        </Grid>
    );
};

export default LoadPaymentsStep1ReadFile;
