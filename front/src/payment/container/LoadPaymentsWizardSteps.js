import {useParams} from "react-router-dom";
import {
    LoadPaymentsStep1ReadFile,
    LoadPaymentsStep2PaymentsTable,
    LoadPaymentsStep3InvoicesTable,
    LoadPaymentsStep4Result,
} from ".";

const LoadPaymentsWizardSteps = ({
    currentStep,
    onValidateStep,
    payments,
    invoices,
    onChangePayments,
    onChangeInvoices,
}) => {
    const {id_mes_facturacion} = useParams();

    const handleChangePayments = payments => {
        onChangePayments(payments);
    };

    const handleChangeInvoices = invoices => {
        onChangeInvoices(invoices);
    };

    const steps = [
        <LoadPaymentsStep1ReadFile
            onChangePayments={handleChangePayments}
            onValidateStep={onValidateStep}
        />,
        <LoadPaymentsStep2PaymentsTable
            payments={payments}
            id_mes_facturacion={id_mes_facturacion}
            onChangePayments={handleChangePayments}
            onValidateStep={onValidateStep}
        />,
        <LoadPaymentsStep3InvoicesTable
            id_mes_facturacion={id_mes_facturacion}
            payments={payments}
            invoices={invoices}
            onChangeInvoices={handleChangeInvoices}
            onValidateStep={onValidateStep}
        />,
        <LoadPaymentsStep4Result
            invoicingMonthId={id_mes_facturacion}
            payments={payments}
        />,
    ];

    return steps[currentStep - 1];
};

export default LoadPaymentsWizardSteps;
