import React from "react";
import LoadMeasurementsStep1ReadFile from "./LoadMeasurementsStep1ReadFile";
import LoadMeasurementsStep2MeasurementsTable from "./LoadMeasurementsStep2MeasurementsTable";
import LoadMeasurementsStep3InvoicesTable from "./LoadMeasurementsStep3InvoicesTable";
import LoadMeasurementsStep4Result from "./LoadMeasurementsStep4Result";
import {Spinner, ErrorMessage} from "components/common";
import {InvoicingMonthService} from "service/api";

class LoadMeasurementsWizard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id_mes_facturacion: null,
            invoicingMonth: null,
            measurements: [],
        };

        this.handleChangeMeasurements = this.handleChangeMeasurements.bind(this);
        this.handleChangeInvoices = this.handleChangeInvoices.bind(this);
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
        this.initSteps();
        this.loadInvoicingMonth();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.id_mes_facturacion !== this.state.id_mes_facturacion) {
            this.initSteps();
            this.loadInvoicingMonth();
        }
    }

    initSteps() {
        this.props.setSteps([
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
        ]);
    }

    loadInvoicingMonth() {
        InvoicingMonthService.getInvoicingMonth(this.state.id_mes_facturacion).then(
            invoicingMonth => {
                this.setState({invoicingMonth});
            }
        );
    }

    handleChangeMeasurements(measurements) {
        console.log("handleChangeMeasurements", measurements);
        this.setState({
            measurements,
        });
    }

    handleChangeInvoices(invoices) {
        console.log("handleChangeInvoices", invoices);
        this.setState({
            invoices,
        });
    }

    render() {
        if (this.state.invoicingMonth != null) {
            if (this.state.invoicingMonth.is_open === true) {
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
                                id_mes_facturacion={this.state.id_mes_facturacion}
                                measurements={this.state.measurements}
                                invoices={this.state.invoices}
                                handleChangeInvoices={this.handleChangeInvoices}
                                setIsValidStep={this.props.setIsValidStep}
                            />
                        );
                    case 4:
                        return (
                            <LoadMeasurementsStep4Result
                                id_mes_facturacion={this.state.id_mes_facturacion}
                                measurements={this.state.measurements}
                                setIsValidStep={this.props.setIsValidStep}
                            />
                        );
                    default:
                        return null;
                }
            }
            return <ErrorMessage message="El mes de facturación no está abierto" />;
        }
        return <Spinner message="Cargando mes de facturación" />;
    }
}

export default LoadMeasurementsWizard;
