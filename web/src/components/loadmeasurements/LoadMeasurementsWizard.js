import React from "react";
import LoadMeasurementsStep1ReadFile from "./LoadMeasurementsStep1ReadFile";
import LoadMeasurementsStep2MeasurementsTable from "./LoadMeasurementsStep2MeasurementsTable";
import LoadMeasurementsStep3Results from "./LoadMeasurementsStep3Results";
import LoadMeasurementsSidebar from "./LoadMeasurementsSidebar";
import {MeasurementService} from "service/file";
import {InvoiceService} from "service/api";
import {
    ImportedDataWizardStepper,
    ImportedDataWizardStepInfo,
} from "components/common/importeddata/wizard";

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
            invoicingMonth: null,
        };

        this.steps = [
            {
                index: 1,
                text: "Cargar archivo",
                icon: "upload",
                help: "Localice el fichero y súbalo al sistema.",
            },
            {
                index: 2,
                text: "Revisar lecturas",
                icon: "table",
                help: "Revise los datos y corrija posibles errores.",
            },
            {
                index: 3,
                text: "Resultado",
                icon: "check-square",
                help: "Revise el resultado de la operación.",
            },
        ];

        this.handleBack = this.handleBack.bind(this);
        this.handleJSONFileLoaded = this.handleJSONFileLoaded.bind(this);
        this.handleChangeMeasurements = this.handleChangeMeasurements.bind(this);
        this.handleMeasurementsValidated = this.handleMeasurementsValidated.bind(this);
    }

    componentDidMount() {
        console.log("componentDidMount", this.state.invoicingMonth);
        if (this.state.invoicingMonth === null) {
            this.loadInvoicingMonth();
        }
    }

    loadInvoicingMonth() {
        InvoiceService.getInvoicingMonth().then(invoicingMonth => {
            console.log("invoicingMonth", invoicingMonth);
            this.setState((prevState, props) => {
                console.log({invoicingMonth});
                return {
                    invoicingMonth,
                };
            });
        });
    }

    handleBack() {
        console.log("LoadMeasurementsWizard.handleBack");
        if (this.props.handleBack) {
            this.props.handleBack();
        } else {
            this.props.history.push("/");
        }
    }

    handleJSONFileLoaded(csvFileLoaded) {
        console.log("handleJSONFileLoaded");
        MeasurementService.getMeasurementsFromJSONContent(csvFileLoaded.content).then(
            measurements => {
                this.setState({
                    measurements,
                });
            }
        );
    }

    handleChangeMeasurements(measurements) {
        this.setState({
            measurements,
        });
    }

    handleMeasurementsValidated(verifiedMeasurements) {
        console.log("handleMeasurementsValidated", verifiedMeasurements);
        this.setState({
            measurements: verifiedMeasurements,
        });
        // Call to service to store data
        // measurementsService.store(verifiedMeasurements);
    }

    /* VIEW SUBCOMPONENTS */

    get measurementsStepper() {
        return (
            <ImportedDataWizardStepper
                steps={this.steps}
                currentStep={this.props.currentStep}
            />
        );
    }

    get stepInfo() {
        return (
            <ImportedDataWizardStepInfo
                step={this.steps[this.props.currentStep - 1]}
                numberOfSteps={this.props.numberOfSteps}
            />
        );
    }

    get currentStepComponent() {
        switch (this.props.currentStep) {
            case 1:
                return (
                    <LoadMeasurementsStep1ReadFile
                        afterValid={this.handleJSONFileLoaded}
                        setIsNextButtonEnabled={this.props.setIsNextButtonEnabled}
                    />
                );
            case 2:
                return (
                    <LoadMeasurementsStep2MeasurementsTable
                        measurements={this.state.measurements}
                        handleChangeData={this.handleChangeMeasurements}
                        setIsNextButtonEnabled={this.props.setIsNextButtonEnabled}
                    />
                );
            case 3:
                return (
                    <LoadMeasurementsStep3Results
                        measurements={this.state.measurements}
                        invoicingMonth={this.state.invoicingMonth}
                    />
                );
            default:
                return null;
        }
    }

    get sidebar() {
        return <LoadMeasurementsSidebar handleBack={this.handleBack} />;
    }

    render() {
        return (
            <div className="h-100">
                <div className="row h-100">
                    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                        {this.sidebar}
                    </nav>
                    <div className="col-md-10 offset-md-2">
                        <div className="d-flex flex-column justify-content-between">
                            <div className="mb-4">{this.measurementsStepper}</div>
                            <div className="rounded-top">{this.stepInfo}</div>
                            <div className="border p-3">
                                {this.currentStepComponent}
                            </div>
                            <div className="border-left border-right border-bottom rounded-bottom p-3">
                                {this.props.buttons}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoadMeasurementsWizard;
