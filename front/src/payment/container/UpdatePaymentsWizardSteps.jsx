import {LoadPaymentsStep4Result, UpdatePaymentsStep1InvoicesTable} from ".";

const UpdatePaymentsWizardSteps = ({
    currentStep,
    onValidateStep,
    payments,
    invoices,
    invoicingMonth,
    paymentType,
    onChangeInvoices,
}) => {
    const handleChangeInvoices = invoices => {
        onChangeInvoices(invoices);
    };

    const steps = [
        <UpdatePaymentsStep1InvoicesTable
            invoicingMonth={invoicingMonth}
            payments={payments}
            invoices={invoices}
            onChangeInvoices={handleChangeInvoices}
            onValidateStep={onValidateStep}
            paymentType={paymentType}
        />,
        <LoadPaymentsStep4Result
            invoicingMonthId={invoicingMonth.id_mes_facturacion}
            payments={payments}
        />,
    ];

    return steps[currentStep - 1];
};

export default UpdatePaymentsWizardSteps;
