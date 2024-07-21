import {
    LoadPaymentsStep1ReadFile,
    LoadPaymentsStep2PaymentsTable,
    LoadPaymentsStep3InvoicesTable,
    LoadPaymentsStep4Result,
} from ".";

const LoadPaymentsWizardSteps = ({
    payments,
    invoices,
    invoicingMonthId,
    currentStep,
    onValidateStep,
    onChangePayments,
    onChangeInvoices,
}) => {
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
            invoicingMonthId={invoicingMonthId}
            onChangePayments={handleChangePayments}
            onValidateStep={onValidateStep}
        />,
        <LoadPaymentsStep3InvoicesTable
            payments={payments}
            invoices={invoices}
            invoicingMonthId={invoicingMonthId}
            onChangeInvoices={handleChangeInvoices}
            onValidateStep={onValidateStep}
        />,
        <LoadPaymentsStep4Result
            payments={payments}
            invoicingMonthId={invoicingMonthId}
        />,
    ];

    return steps[currentStep - 1];
};

export default LoadPaymentsWizardSteps;
