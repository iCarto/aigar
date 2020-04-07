import React from "react";
import {LoadDataValidatorService} from "service/validation";
import {LoadDataFileUpload} from "components/common/loaddata/fileupload";
import {MeasurementService} from "service/file";

class LoadMeasurementsStep1ReadFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataFiles: [],
        };
        this.handleLoadedDataFile = this.handleLoadedDataFile.bind(this);
        this.handleRemoveDataFile = this.handleRemoveDataFile.bind(this);
        this.handleChangeMeasurements = this.handleChangeMeasurements.bind(this);
    }

    componentDidMount() {
        this.props.setIsValidStep(false);
    }

    handleLoadedDataFile(dataFile) {
        dataFile.errors = LoadDataValidatorService.validateMeasurementsFile(dataFile);
        this.setState(
            prevState => {
                const dataFiles = prevState.dataFiles;
                dataFiles.push(dataFile);
                return {
                    dataFiles,
                };
            },
            () => {
                this.handleChangeMeasurements();
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
                this.handleChangeMeasurements();
            }
        );
    }

    handleChangeMeasurements() {
        const hasErrors = this.state.dataFiles.some(
            dataFile => dataFile.errors.length !== 0
        );
        if (!hasErrors) {
            const content = MeasurementService.mergeFileContents(
                this.state.dataFiles.map(dataFile => dataFile.content)
            );
            MeasurementService.getMeasurementsFromJSONContent(
                JSON.stringify(content)
            ).then(measurements => {
                this.props.handleChangeMeasurements(measurements);
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
                allowedFormats={[".json"]}
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

export default LoadMeasurementsStep1ReadFile;
