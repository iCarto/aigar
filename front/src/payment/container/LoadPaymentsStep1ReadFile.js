import {useState, useEffect} from "react";
import {LoadDataValidatorService} from "validation";
import {LoadDataFileUpload} from "base/loaddata/fileupload";
import {PaymentService} from "payment/service";

const LoadPaymentsStep1ReadFile = ({onValidateStep, onChangePayments}) => {
    const [dataFiles, setDataFiles] = useState([]);

    useEffect(() => {
        onValidateStep(false);
    }, []);

    /* HANDLERS FOR UI EVENTS */
    const handleLoadedDataFile = dataFile => {
        dataFile.errors = LoadDataValidatorService.validatePaymentsFile(dataFile);
        const updatedDataFiles = [...dataFiles, dataFile];
        setDataFiles(updatedDataFiles);
        handleChangePayments();
    };

    const handleRemoveDataFile = filename => {
        const updatedDataFiles = dataFiles.filter(
            dataFile => dataFile.file.name !== filename
        );
        setDataFiles(updatedDataFiles);
        handleChangePayments();
    };

    const handleChangePayments = () => {
        const hasErrors = dataFiles.some(dataFile => dataFile.errors.length !== 0);
        if (!hasErrors) {
            const content = PaymentService.mergeFileContents(
                dataFiles.map(dataFile => dataFile.content)
            );
            PaymentService.getPaymentsFromCSVContent(content).then(payments => {
                onChangePayments(payments);
            });
        }
        console.log({dataFiles});
        onValidateStep(dataFiles.length !== 0 && !hasErrors);
    };

    return (
        <div className="col-12 row justify-content-center">
            <form className="col-md-8 p-3">
                <LoadDataFileUpload
                    dataFiles={dataFiles}
                    handleLoadedDataFile={handleLoadedDataFile}
                    handleRemoveDataFile={handleRemoveDataFile}
                    allowedFormats={[".csv", ".txt"]}
                />
            </form>
        </div>
    );
};

export default LoadPaymentsStep1ReadFile;
