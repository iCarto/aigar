import React from "react";
import LoadPaymentsStep1ReadFile from "./LoadPaymentsStep1ReadFile";
import LoadPaymentsStep2PaymentsTable from "./LoadPaymentsStep2PaymentsTable";
import LoadPaymentsStep3InvoicesTable from "./LoadPaymentsStep3InvoicesTable";
import LoadPaymentsStep4Result from "./LoadPaymentsStep4Result";
import {Spinner, ErrorMessage} from "components/common";
import {InvoicingMonthService} from "service/api";

class LoadPaymentsWizard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            payments: [],
        };

        this.handleChangePayments = this.handleChangePayments.bind(this);
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
                text: "Revisar pagos",
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

    handleChangePayments(payments) {
        console.log("handleChangePayments", payments);
        this.setState({
            payments,
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
                            <LoadPaymentsStep1ReadFile
                                handleChangePayments={this.handleChangePayments}
                                setIsValidStep={this.props.setIsValidStep}
                            />
                        );
                    case 2:
                        return (
                            <LoadPaymentsStep2PaymentsTable
                                payments={this.state.payments}
                                id_mes_facturacion={this.state.id_mes_facturacion}
                                handleChangePayments={this.handleChangePayments}
                                setIsValidStep={this.props.setIsValidStep}
                            />
                        );
                    case 3:
                        return (
                            <LoadPaymentsStep3InvoicesTable
                                id_mes_facturacion={this.state.id_mes_facturacion}
                                payments={this.state.payments}
                                invoices={this.state.invoices}
                                handleChangeInvoices={this.handleChangeInvoices}
                                setIsValidStep={this.props.setIsValidStep}
                            />
                        );
                    case 4:
                        return (
                            <LoadPaymentsStep4Result
                                id_mes_facturacion={this.state.id_mes_facturacion}
                                payments={this.state.payments}
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

export default LoadPaymentsWizard;
