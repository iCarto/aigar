import React from "react";
import LoadDataFileUpload from "../common/loaddata/fileupload/LoadDataFileUpload";
import {CSVFile} from "model";
import {LoadDataValidatorService} from "service/validation";

class LoadMeasurementsStep1ReadFile extends React.Component {
    state = {
        csvFile: null,

        fieldErrors: {
            csvFile: null,
        },
    };

    constructor(props) {
        super(props);
        this.handleMeasurementsFileRead = this.handleMeasurementsFileRead.bind(this);
    }

    isCSVFileValid() {
        return (
            this.state.csvFile != null &&
            this.state.fieldErrors.csvFile != null &&
            this.state.fieldErrors.csvFile.length === 0
        );
    }

    /* HANDLERS FOR UI EVENTS */
    handleMeasurementsFileRead(file, content) {
        let csvFile = new CSVFile({
            file,
            content,
        });
        this.setState(
            {
                csvFile,
                fieldErrors: {
                    csvFile: LoadDataValidatorService.validateMeasurementsFile(csvFile),
                },
            },
            () => {
                this.props.setIsNextButtonEnabled(
                    this.state.fieldErrors.csvFile.length === 0
                );
                if (this.state.fieldErrors.csvFile.length === 0) {
                    this.props.afterValid(this.state.csvFile);
                }
            }
        );
    }

    /* VIEW SUBCOMPONENTS */

    get messages() {
        if (!this.state.csvFile) {
            return null;
        } else if (this.state.fieldErrors.csvFile.length === 0) {
            return (
                <div className="alert alert-success" role="alert">
                    El fichero es correcto
                </div>
            );
        } else {
            return (
                <div className="alert alert-danger" role="alert">
                    <ul>
                        {this.state.fieldErrors.csvFile.map(error => {
                            return <li key={error.msg}>{error.msg}</li>;
                        })}
                    </ul>
                </div>
            );
        }
    }

    get fileUpload() {
        return (
            <LoadDataFileUpload
                handleFileRead={this.handleMeasurementsFileRead}
                allowedFormats={[".json"]}
            />
        );
    }

    render() {
        return (
            <div className="col-12 row justify-content-center">
                <form className="col-md-8 card p-3 bg-light">
                    {this.fileUpload}
                    {this.messages}
                </form>
            </div>
        );
    }
}

export default LoadMeasurementsStep1ReadFile;
