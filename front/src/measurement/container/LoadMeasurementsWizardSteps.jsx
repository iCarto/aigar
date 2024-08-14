import {useParams} from "react-router-dom";
import {
    LoadMeasurementsStep1ReadFile,
    LoadMeasurementsStep2MeasurementsTable,
    LoadMeasurementsStep3InvoicesTable,
    LoadMeasurementsStep4Result,
} from ".";

export const LoadMeasurementsWizardSteps = ({
    currentStep,
    onValidateStep,
    measurements,
    invoices,
    onChangeMeasurements,
    onChangeInvoices,
}) => {
    const {id_mes_facturacion} = useParams();

    const handleChangeMeasurements = measurements => {
        onChangeMeasurements(measurements);
    };

    const handleChangeInvoices = invoices => {
        onChangeInvoices(invoices);
    };

    const steps = [
        <LoadMeasurementsStep1ReadFile
            onChangeMeasurements={handleChangeMeasurements}
            onValidateStep={onValidateStep}
        />,
        <LoadMeasurementsStep2MeasurementsTable
            measurements={measurements}
            onChangeMeasurements={handleChangeMeasurements}
            onValidateStep={onValidateStep}
        />,
        <LoadMeasurementsStep3InvoicesTable
            id_mes_facturacion={id_mes_facturacion}
            measurements={measurements}
            invoices={invoices}
            onChangeInvoices={handleChangeInvoices}
            onValidateStep={onValidateStep}
        />,
        <LoadMeasurementsStep4Result
            id_mes_facturacion={id_mes_facturacion}
            measurements={measurements}
        />,
    ];

    return steps[currentStep - 1];
};
