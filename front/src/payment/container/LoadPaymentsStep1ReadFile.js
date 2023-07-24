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
        setDataFiles(prevState => {
            const updatedDataFiles = [...prevState, dataFile];
            return updatedDataFiles;
        });
        onChangePayments();
    };

    const handleRemoveDataFile = filename => {
        setDataFiles(prevState => {
            const updatedDataFiles = prevState.filter(
                dataFile => dataFile.file.name !== filename
            );
            return updatedDataFiles;
        });
        handleChangePayments();
    };

    const handleChangePayments = () => {
        const hasErrors = dataFiles.some(dataFile => dataFile.errors.length !== 0);
        if (!hasErrors) {
            const content = PaymentService.mergeFileContents(
                dataFiles.map(dataFile => dataFile.content)
            );
            PaymentService.getPaymentsFromCSVContent(content).then(payments => {
                handleChangePayments(payments);
            });
        }
        onValidateStep(dataFiles.length !== 0 && !hasErrors);
    };

    /* VIEW SUBCOMPONENTS */

    const fileUpload = (
        <LoadDataFileUpload
            dataFiles={dataFiles}
            handleLoadedDataFile={handleLoadedDataFile}
            handleRemoveDataFile={handleRemoveDataFile}
            allowedFormats={[".csv", ".txt"]}
        />
    );

    return (
        <div className="col-12 row justify-content-center">
            <form className="col-md-8 p-3">{fileUpload}</form>
        </div>
    );
};

export default LoadPaymentsStep1ReadFile;
