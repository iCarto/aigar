import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {InvoicingMonthService} from "service/api";
import {Wizard} from "base/ui/wizard";
import {Spinner, ErrorMessage} from "components/common";
import {LoadPaymentsWizardSteps} from ".";
import loadPaymentsAndMeasurementsSteps from "../data";

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
