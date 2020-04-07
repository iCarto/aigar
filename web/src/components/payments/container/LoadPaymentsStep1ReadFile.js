import React from "react";
import {LoadDataValidatorService} from "service/validation";
import {LoadDataFileUpload} from "components/common/loaddata/fileupload";
import {PaymentService} from "service/file";

class LoadPaymentsStep1ReadFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataFiles: [],
        };
        this.handleLoadedDataFile = this.handleLoadedDataFile.bind(this);
        this.handleRemoveDataFile = this.handleRemoveDataFile.bind(this);
        this.handleChangePayments = this.handleChangePayments.bind(this);
    }

    componentDidMount() {
        this.props.setIsValidStep(false);
    }

    /* HANDLERS FOR UI EVENTS */
    handleLoadedDataFile(dataFile) {
        dataFile.errors = LoadDataValidatorService.validatePaymentsFile(dataFile);
        this.setState(
            prevState => {
                const dataFiles = prevState.dataFiles;
                dataFiles.push(dataFile);
                return {
                    dataFiles,
                };
            },
            () => {
                this.handleChangePayments();
            }
        );
    }

    handleRemoveDataFile(filename) {
        this.setState(
            prevState => {
                const dataFiles = prevState.dataFiles;
                const index = dataFiles.findIndex(
                    dataFile => dataFile.file.name === filename
                );
                dataFiles.splice(index, 1);
                return {
                    dataFiles,
                };
            },
            () => {
                this.handleChangePayments();
            }
        );
    }

    handleChangePayments() {
        const hasErrors = this.state.dataFiles.some(
            dataFile => dataFile.errors.length !== 0
        );
        if (!hasErrors) {
            const content = PaymentService.mergeFileContents(
                this.state.dataFiles.map(dataFile => dataFile.content)
            );
            PaymentService.getPaymentsFromCSVContent(content).then(payments => {
                this.props.handleChangePayments(payments);
            });
        }
        this.props.setIsValidStep(this.state.dataFiles.length !== 0 && !hasErrors);
    }

    /* VIEW SUBCOMPONENTS */

    get fileUpload() {
        return (
            <LoadDataFileUpload
                dataFiles={this.state.dataFiles}
                handleLoadedDataFile={this.handleLoadedDataFile}
                handleRemoveDataFile={this.handleRemoveDataFile}
                allowedFormats={[".csv", ".txt"]}
            />
        );
    }

    render() {
        return (
            <div className="col-12 row justify-content-center">
                <form className="col-md-8 p-3">{this.fileUpload}</form>
            </div>
        );
    }
}

export default LoadPaymentsStep1ReadFile;
