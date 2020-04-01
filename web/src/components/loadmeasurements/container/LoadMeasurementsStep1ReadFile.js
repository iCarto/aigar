import React from "react";
import {LoadDataValidatorService} from "service/validation";
import {LoadDataFileUpload} from "components/common/loaddata/fileupload";
import {MeasurementService} from "service/file";

class LoadMeasurementsStep1ReadFile extends React.Component {
    constructor(props) {
        super(props);
        this.handleValidation = this.handleValidation.bind(this);
        this.handleJSONFileLoaded = this.handleJSONFileLoaded.bind(this);
    }

    componentDidMount() {
        this.props.setIsValidStep(false);
    }

    /* HANDLERS FOR UI EVENTS */
    handleJSONFileLoaded(jsonFileLoaded) {
        console.log("handleJSONFileLoaded", jsonFileLoaded);
        MeasurementService.getMeasurementsFromJSONContent(jsonFileLoaded.content).then(
            measurements => {
                this.props.handleChangeMeasurements(measurements);
            }
        );
    }

    handleValidation(jsonDataFile) {
        this.props.setIsValidStep(false);
        const errors = LoadDataValidatorService.validateMeasurementsFile(jsonDataFile);
        this.props.setIsValidStep(errors.length === 0);
        return errors;
    }

    /* VIEW SUBCOMPONENTS */

    get fileUpload() {
        return (
            <LoadDataFileUpload
                handleFileRead={this.handleJSONFileLoaded}
                validator={this.handleValidation}
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
