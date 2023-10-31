import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";

import {InvoicingMonthService} from "monthlyinvoicing/service";
import {loadPaymentsSteps} from "payment/data";

import {ErrorMessage} from "base/error/components";
import {Spinner} from "base/ui/other/components";
import {Wizard} from "base/ui/wizard/components";

import {LoadPaymentsWizardSteps} from ".";

const LoadPaymentsWizard = () => {
    const [payments, setPayments] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [invoicingMonth, setInvoicingMonth] = useState(null);
    const [isValidStep, setIsValidStep] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);

    const {id_mes_facturacion} = useParams();

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
        setCurrentStep(currentStep);
    };

    const validateStep = isStepValid => {
        setIsValidStep(isStepValid);
    };

    return (
        <Wizard
            heading="Importar pagos"
            steps={loadPaymentsSteps}
            currentStep={currentStep}
            isValidStep={isValidStep}
            onChangeStep={handleChangeStep}
        >
            {!invoicingMonth ? (
                <Spinner message="Cargando mes de facturación" />
            ) : invoicingMonth.is_open ? (
                <LoadPaymentsWizardSteps
                    payments={payments}
                    invoices={invoices}
                    invoicingMonthId={id_mes_facturacion}
                    currentStep={currentStep}
                    onValidateStep={validateStep}
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
