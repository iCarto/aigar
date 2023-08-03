import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";

import {InvoicingMonthService} from "monthlyinvoicing/service";
import loadPaymentsAndMeasurementsSteps from "payment/data";
import {Wizard} from "base/ui/wizard";
import {ErrorMessage} from "base/error/components";
import {Spinner} from "base/common";
import {LoadPaymentsWizardSteps} from ".";

const LoadPaymentsWizard = () => {
    const [payments, setPayments] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [invoicingMonth, setInvoicingMonth] = useState(null);
    const [isValidStep, setIsValidStep] = useState(true);

    // TO-DO: Review this - same state is also handled in component Wizard
    const [currentStep, setCurrentStep] = useState(1);

    const {id_mes_facturacion} = useParams();
    const wizardSteps = loadPaymentsAndMeasurementsSteps;

    useEffect(() => {
        InvoicingMonthService.getInvoicingMonth(id_mes_facturacion).then(
            invoicingMonth => {
                setInvoicingMonth(invoicingMonth);
            }
        );
    }, [id_mes_facturacion]);

    const handleChangePayments = payments => {
        console.log("handleChangePayments", payments);
        setPayments(payments);
    };

    const handleChangeInvoices = invoices => {
        console.log("handleChangeInvoices", invoices);
        setInvoices(invoices);
    };

    const handleChangeStep = currentStep => {
        console.log(currentStep);
        setCurrentStep(currentStep);
    };

    const validateStep = isStepValid => {
        setIsValidStep(isStepValid);
    };

    return (
        <Wizard
            heading="Importar pagos"
            steps={wizardSteps}
            isValidStep={isValidStep}
            onChangeStep={handleChangeStep}
        >
            {!invoicingMonth ? (
                <Spinner message="Cargando mes de facturación" />
            ) : invoicingMonth.is_open ? (
                <LoadPaymentsWizardSteps
                    currentStep={currentStep}
                    onValidateStep={validateStep}
                    payments={payments}
                    invoices={invoices}
                    onChangePayments={handleChangePayments}
                    onChangeInvoices={handleChangeInvoices}
                />
            ) : (
                <ErrorMessage message="El mes de facturación no está abierto" />
            )}
        </Wizard>
    );
};

export default LoadPaymentsWizard;
