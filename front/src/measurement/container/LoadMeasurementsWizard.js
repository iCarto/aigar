import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";

import {InvoicingMonthService} from "monthlyinvoicing/service";
import {loadMeasurementsSteps} from "measurement/data";

import {LoadMeasurementsWizardSteps} from ".";
import {Wizard} from "base/ui/wizard";
import {Spinner} from "base/common";
import {ErrorMessage} from "base/error/components";

const LoadMeasurementsWizard = () => {
    const [measurements, setMeasurements] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [invoicingMonth, setInvoicingMonth] = useState(null);
    const [isValidStep, setIsValidStep] = useState(true);

    // TO-DO: Review this - same state is also handled in component Wizard
    const [currentStep, setCurrentStep] = useState(1);

    const {id_mes_facturacion} = useParams();

    useEffect(() => {
        InvoicingMonthService.getInvoicingMonth(id_mes_facturacion).then(
            invoicingMonth => {
                setInvoicingMonth(invoicingMonth);
            }
        );
    }, [id_mes_facturacion]);

    const handleChangeMeasurements = measurements => {
        console.log("handleChangeMeasurements", measurements);
        setMeasurements(measurements);
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
            heading="Importar lecturas"
            steps={loadMeasurementsSteps}
            isValidStep={isValidStep}
            onChangeStep={handleChangeStep}
        >
            {!invoicingMonth ? (
                <Spinner message="Cargando mes de facturación" />
            ) : invoicingMonth.is_open ? (
                <LoadMeasurementsWizardSteps
                    currentStep={currentStep}
                    onValidateStep={validateStep}
                    measurements={measurements}
                    invoices={invoices}
                    onChangeMeasurements={handleChangeMeasurements}
                    onChangeInvoices={handleChangeInvoices}
                />
            ) : (
                <ErrorMessage message="El mes de facturación no está abierto" />
            )}
        </Wizard>
    );
};

export default LoadMeasurementsWizard;
