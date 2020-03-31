import React from "react";
import LoadMeasurementsStep1ReadFile from "./LoadMeasurementsStep1ReadFile";
import LoadMeasurementsStep2MeasurementsTable from "./LoadMeasurementsStep2MeasurementsTable";
import LoadMeasurementsStep3InvoicesTable from "./LoadMeasurementsStep3InvoicesTable";
import {MeasurementService} from "service/file";
import {InvoicingMonthService} from "service/api";

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
            id_mes_facturacion: null,
            invoicingMonth: null,
            measurements: [],
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
        props.setSteps(this.steps);

        this.handleJSONFileLoaded = this.handleJSONFileLoaded.bind(this);
        this.handleChangeMeasurements = this.handleChangeMeasurements.bind(this);
    }

    static getDerivedStateFromProps(props, prevState) {
        const id_mes_facturacion =
            props.id_mes_facturacion || props.match.params.id_mes_facturacion;
        if (id_mes_facturacion !== prevState.id_mes_facturacion) {
            return {
                invoicingMonth: null,
                id_mes_facturacion,
            };
        }
        return null;
    }

    componentDidMount() {
        this.loadInvoicingMonth();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.id_mes_facturacion !== this.state.id_mes_facturacion) {
            this.loadInvoicingMonth();
        }
    }

    loadInvoicingMonth() {
        InvoicingMonthService.getInvoicingMonth(this.state.id_mes_facturacion).then(
            invoicingMonth => {
                console.log("invoicingMonth", invoicingMonth);
                this.setState((prevState, props) => {
                    console.log({invoicingMonth});
                    return {
                        invoicingMonth,
                    };
                });
            }
        );
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
