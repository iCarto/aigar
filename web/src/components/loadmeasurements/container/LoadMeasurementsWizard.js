import React from "react";
import LoadMeasurementsStep1ReadFile from "./LoadMeasurementsStep1ReadFile";
import LoadMeasurementsStep2MeasurementsTable from "./LoadMeasurementsStep2MeasurementsTable";
import LoadMeasurementsStep4Result from "./LoadMeasurementsStep4Result";
import {InvoicingMonthService} from "service/api";
import LoadMeasurementsStep3InvoicesTable from "./LoadMeasurementsStep3InvoicesTable";
import {Spinner} from "components/common";

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
                text: "Revisar facturas",
                icon: "file-invoice",
                help: "Revise las facturas con los consumos aplicados.",
            },
            {
                index: 4,
                text: "Resultado",
                icon: "check-circle",
                help: "Revise el resultado de la operación.",
            },
        ];
        props.setSteps(this.steps);

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

    handleChangeMeasurements(measurements) {
        console.log("handleChangeMeasurements", measurements);
        this.setState({
            measurements,
        });
    }

    handleChangeInvoicingMonth(invoicingMonth) {
        console.log("handleChangeInvoicingMonth", invoicingMonth);
        this.setState({
            invoicingMonth,
        });
    }

    render() {
        if (this.state.invoicingMonth) {
            switch (this.props.currentStep) {
                case 1:
                    return (
                        <LoadMeasurementsStep1ReadFile
                            handleChangeMeasurements={this.handleChangeMeasurements}
                            setIsValidStep={this.props.setIsValidStep}
                        />
                    );
                case 2:
                    return (
                        <LoadMeasurementsStep2MeasurementsTable
                            measurements={this.state.measurements}
                            handleChangeMeasurements={this.handleChangeMeasurements}
                            setIsValidStep={this.props.setIsValidStep}
                        />
                    );
                case 3:
                    return (
                        <LoadMeasurementsStep3InvoicesTable
                            measurements={this.state.measurements}
                            invoicingMonth={this.state.invoicingMonth}
                            setIsValidStep={this.props.setIsValidStep}
                        />
                    );
                case 4:
                    return (
                        <LoadMeasurementsStep4Result
                            measurements={this.state.measurements}
                            invoicingMonth={this.state.invoicingMonth}
                            setIsValidStep={this.props.setIsValidStep}
                        />
                    );
                default:
                    return null;
            }
        }
        return <Spinner />;
    }
}

export default LoadMeasurementsWizard;
