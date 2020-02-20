import React from "react";
import LoadMeasurementsStepper from "./LoadMeasurementsStepper";
import LoadMeasurementsStep1ReadFile from "./LoadMeasurementsStep1ReadFile";
import LoadMeasurementsStep2MeasurementsTable from "./LoadMeasurementsStep2MeasurementsTable";
import LoadMeasurementsStep3Results from "./LoadMeasurementsStep3Results";
import MeasurementService from "service/MeasurementsService";

/*
Higher order component that:
- wraps all the other components
- implements flow navigation between child components
- use service to manage data
*/
class LoadMeasurementsWizard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            measurements: [],
        };
        this.handleCSVFileLoaded = this.handleCSVFileLoaded.bind(this);
    }

    handleCSVFileLoaded(csvFileLoaded) {
        this.setState({
            measurements: MeasurementService.getMeasurementsFromCSVContent(
                csvFileLoaded.content
            ),
        });
    }

    handleMeasurementsValidated(verifiedMeasurements) {
        this.setState({
            measurements: verifiedMeasurements,
        });
        // Call to service to store data
        // measurementsService.store(verifiedMeasurements);
    }

    /* VIEW SUBCOMPONENTS */

    get measurementsStepper() {
        return <LoadMeasurementsStepper currentStep={this.props.currentStep} />;
    }

    get currentStepComponent() {
        switch (this.props.currentStep) {
            case 1:
                return (
                    <LoadMeasurementsStep1ReadFile
                        next={this.props.next}
                        afterValid={this.handleCSVFileLoaded}
                    />
                );
            case 2:
                return (
                    <LoadMeasurementsStep2MeasurementsTable
                        prev={this.props.prev}
                        next={this.props.next}
                        afterValid={this.handleMeasurementsValidated}
                        measurements={this.state.measurements}
                    />
                );
            case 3:
                return (
                    <LoadMeasurementsStep3Results
                        prev={this.props.prev}
                        measurements={this.state.measurements}
                    />
                );
            default:
                return null;
        }
    }

    render() {
        return (
            <div className="row col-md-8 offset-md-2">
                {this.measurementsStepper}
                {this.currentStepComponent}
                {this.previousButton}
                {this.nextButton}
            </div>
        );
    }
}

export default LoadMeasurementsWizard;
