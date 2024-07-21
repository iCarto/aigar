import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";

import {useMonthlyInvoicingList} from "monthlyinvoicing/provider";
import {loadMeasurementsSteps} from "measurement/data";

import {LoadMeasurementsWizardSteps} from ".";
import {Wizard} from "base/ui/wizard/components";
import {Spinner} from "base/ui/other/components";
import {ErrorMessage} from "base/error/components";

const LoadMeasurementsWizard = () => {
    const [measurements, setMeasurements] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [isValidStep, setIsValidStep] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);

    const {id_mes_facturacion: urlMonthId} = useParams();
    const {selectedInvoicingMonth} = useMonthlyInvoicingList();

    const urlMatchesSelectedMonth =
        urlMonthId === selectedInvoicingMonth?.id_mes_facturacion;

    useEffect(() => {
        if (!urlMatchesSelectedMonth) setIsValidStep(false);
    }, [urlMatchesSelectedMonth]);

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
            currentStep={currentStep}
            isValidStep={isValidStep}
            onChangeStep={handleChangeStep}
        >
            {!selectedInvoicingMonth ? (
                <Spinner message="Cargando mes de facturación" />
            ) : !selectedInvoicingMonth.is_open || !urlMatchesSelectedMonth ? (
                <ErrorMessage message="El mes de facturación no está abierto" />
            ) : (
                <LoadMeasurementsWizardSteps
                    currentStep={currentStep}
                    onValidateStep={validateStep}
                    measurements={measurements}
                    invoices={invoices}
                    onChangeMeasurements={handleChangeMeasurements}
                    onChangeInvoices={handleChangeInvoices}
                />
            )}
        </Wizard>
    );
};

export default LoadMeasurementsWizard;
