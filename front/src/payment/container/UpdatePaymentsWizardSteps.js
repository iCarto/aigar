import {LoadPaymentsStep4Result, UpdatePaymentsStep1InvoicesTable} from ".";

const UpdatePaymentsWizardSteps = ({
    currentStep,
    onValidateStep,
    payments,
    invoices,
    invoicingMonth,
    paymentType,
    onChangeInvoices,
    onChangePayments,
}) => {
    const handleChangePayments = payments => {
        onChangePayments(payments);
    };

    const handleChangeInvoices = invoices => {
        onChangeInvoices(invoices);
    };

    const steps = [
        <UpdatePaymentsStep1InvoicesTable
            invoicingMonth={invoicingMonth}
            payments={payments}
            invoices={invoices}
            onChangeInvoices={handleChangeInvoices}
            onChangePayments={handleChangePayments}
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
