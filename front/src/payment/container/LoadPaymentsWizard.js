import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";

import {useMonthlyInvoicingList} from "monthlyinvoicing/provider";
import {loadPaymentsSteps} from "payment/data";

import {LoadPaymentsWizardSteps} from ".";
import {Wizard} from "base/ui/wizard/components";
import {Spinner} from "base/ui/other/components";
import {ErrorMessage} from "base/error/components";

const LoadPaymentsWizard = () => {
    const [payments, setPayments] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [isValidStep, setIsValidStep] = useState(true);

    // TO-DO: Review this - same state is also handled in component Wizard
    const [currentStep, setCurrentStep] = useState(1);

    const {id_mes_facturacion: urlMonthId} = useParams();
    const {selectedInvoicingMonth} = useMonthlyInvoicingList();

    const urlMatchesSelectedMonth =
        urlMonthId === selectedInvoicingMonth?.id_mes_facturacion;

    useEffect(() => {
        if (!urlMatchesSelectedMonth) setIsValidStep(false);
    }, [urlMatchesSelectedMonth]);

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
            isValidStep={isValidStep}
            onChangeStep={handleChangeStep}
        >
            {!selectedInvoicingMonth ? (
                <Spinner message="Cargando mes de facturación" />
            ) : !selectedInvoicingMonth.is_open || !urlMatchesSelectedMonth ? (
                <ErrorMessage message="El mes de facturación no está abierto" />
            ) : (
                <LoadPaymentsWizardSteps
                    currentStep={currentStep}
                    onValidateStep={validateStep}
                    payments={payments}
                    invoices={invoices}
                    onChangePayments={handleChangePayments}
                    onChangeInvoices={handleChangeInvoices}
                />
            )}
        </Wizard>
    );
};

export default LoadPaymentsWizard;
