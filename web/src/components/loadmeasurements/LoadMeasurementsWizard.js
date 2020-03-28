import React from "react";
import LoadMeasurementsStep1ReadFile from "./LoadMeasurementsStep1ReadFile";
import LoadMeasurementsStep2MeasurementsTable from "./LoadMeasurementsStep2MeasurementsTable";
import LoadMeasurementsStep3InvoicesTable from "./LoadMeasurementsStep3InvoicesTable";
import {MeasurementService} from "service/file";
import {InvoiceService} from "service/api";

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
                icon: "check-circle",
                help: "Revise el resultado de la operación.",
            },
        ];

        this.handleJSONFileLoaded = this.handleJSONFileLoaded.bind(this);
        this.handleChangeMeasurements = this.handleChangeMeasurements.bind(this);
    }

    componentDidMount() {
        console.log("componentDidMount", this.state.invoicingMonth);
        this.props.setSteps(this.steps);
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

    /* VIEW SUBCOMPONENTS */

    render() {
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
                        setIsPreviousButtonEnabled={
                            this.props.setIsPreviousButtonEnabled
                        }
                    />
                );
            case 3:
                return (
                    <LoadMeasurementsStep3InvoicesTable
                        measurements={this.state.measurements}
                        invoicingMonth={this.state.invoicingMonth}
                        setIsPreviousButtonEnabled={
                            this.props.setIsPreviousButtonEnabled
                        }
                    />
                );
            default:
                return null;
        }
    }
}

export default LoadMeasurementsWizard;
