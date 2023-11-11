import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";

import {DateUtil} from "base/format/utilities";

import {LoadDataValidatorService} from "validation/service";
import {createPayment} from "payment/model";
import {createInvoice} from "invoice/model";
import {updatePaymentsSteps} from "payment/data";
import {useDomain} from "aigar/domain/provider";
import {useMonthlyInvoicingList} from "monthlyinvoicing/provider";

import {UpdatePaymentsWizardSteps} from ".";
import {Wizard} from "base/ui/wizard/components";
import {Spinner} from "base/ui/other/components";
import {ErrorMessage} from "base/error/components";
import {Modal} from "base/ui/modal/components";
import {BasicButton} from "base/ui/buttons/components";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const UpdatePaymentsWizard = () => {
    const [payments, setPayments] = useState([]);
    const [prefilledInvoices, setPrefilledInvoices] = useState([]);
    const [isValidStep, setIsValidStep] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {id_mes_facturacion: urlMonthId, mode} = useParams();
    const {aigarConfig} = useDomain();
    const {invoicesToUpdate, selectedInvoicingMonth} = useMonthlyInvoicingList();

    const paymentType = mode.includes("mora") ? "late" : "ontime";

    const urlMatchesSelectedMonth =
        urlMonthId === selectedInvoicingMonth?.id_mes_facturacion;

    useEffect(() => {
        setPrefilledInvoices(prefillInvoices());
        if (!urlMatchesSelectedMonth) setIsValidStep(false);
    }, [urlMatchesSelectedMonth]);

    const prefillInvoices = () => {
        return invoicesToUpdate.map(invoice => {
            if (paymentType === "late") {
                return createInvoice({
                    ...invoice,
                    late_payment: invoice.late_payment || invoice.total,
                    errors: [],
                });
            } else
                return createInvoice({
                    ...invoice,
                    ontime_payment: invoice.ontime_payment || invoice.total,
                    errors: [],
                });
        });
    };

    const generatePaymentDates = () => {
        const paymentMonth = parseInt(selectedInvoicingMonth?.mes) + 1;

        const getDateString = day => {
            return DateUtil.getDateString(
                selectedInvoicingMonth?.anho,
                paymentMonth,
                day
            );
        };

        const latePaymentDate = getDateString(aigarConfig.payment_due_day + 1);
        const ontimePaymentDate = getDateString("01");

        return {latePaymentDate, ontimePaymentDate};
    };

    const createInvoicePayments = invoices => {
        const {latePaymentDate, ontimePaymentDate} = generatePaymentDates();
        const invoicePayments = [];

        // If invoice already has a value for late or ontime payment, then those values should be taken for creating each corresponding payment. Else, the type of payment will be created taking the total invoice value as the payment amount (monto).
        const dateForNewInvoices =
            paymentType === "late" ? latePaymentDate : ontimePaymentDate;

        invoices.map(invoice => {
            if (!invoice.ontime_payment && !invoice.late_payment)
                invoicePayments.push(
                    createInvoicePayment(invoice, dateForNewInvoices, invoice.total)
                );

            if (invoice.ontime_payment)
                invoicePayments.push(
                    createInvoicePayment(
                        invoice,
                        ontimePaymentDate,
                        invoice.ontime_payment
                    )
                );

            if (invoice.late_payment)
                invoicePayments.push(
                    createInvoicePayment(invoice, latePaymentDate, invoice.late_payment)
                );
        });

        return invoicePayments;
    };

    const createInvoicePayment = (invoice, date, amount) => {
        const payment = {
            invoice: invoice.id,
            fecha: date,
            monto: amount,
            // We need num_factura only to avoid validation error
            num_factura: invoice.numero,
        };
        return createPayment({
            ...payment,
            errors: LoadDataValidatorService.validatePaymentEntry(payment, invoice),
        });
    };

    const handleChangeInvoices = invoices => {
        setPrefilledInvoices(invoices);
        setPayments(createInvoicePayments(invoices));
    };

    const handleChangeStep = currentStep => {
        if (currentStep !== updatePaymentsSteps.length - 1) {
            setIsModalOpen(true);
        } else {
            setCurrentStep(currentStep);
        }
    };

    const navigateToNextStep = () => {
        if (!payments.length) setPayments(createInvoicePayments(prefilledInvoices));
        setIsModalOpen(false);
        setCurrentStep(2);
    };

    const validateStep = isStepValid => {
        setIsValidStep(isStepValid);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleClickOutsideModal = () => {
        return;
    };

    const modalBody = (
        <Alert severity="warning">
            <AlertTitle>Antes de continuar, asegúrese de revisar:</AlertTitle>
            <ul>
                <li>Los montos y números de los recibos</li>
                <li>Los montos de los pagos realizados</li>
            </ul>
        </Alert>
    );

    const modalFooter = (
        <>
            <BasicButton
                text="Volver a revisar"
                onClick={closeModal}
                variant="outlined"
            />
            <BasicButton text="Continuar" onClick={navigateToNextStep} />
        </>
    );

    const confirmationModal = (
        <Modal
            isOpen={isModalOpen}
            onClose={handleClickOutsideModal}
            body={modalBody}
            footer={modalFooter}
        />
    );

    return (
        <Wizard
            heading="Actualizar pagos"
            steps={updatePaymentsSteps}
            currentStep={currentStep}
            isValidStep={isValidStep}
            onChangeStep={handleChangeStep}
        >
            {!selectedInvoicingMonth ? (
                <Spinner message="Cargando mes de facturación" />
            ) : !selectedInvoicingMonth.is_open || !urlMatchesSelectedMonth ? (
                <ErrorMessage message="El mes de facturación no está abierto" />
            ) : (
                <UpdatePaymentsWizardSteps
                    payments={payments}
                    paymentType={paymentType}
                    invoices={prefilledInvoices}
                    invoicingMonth={selectedInvoicingMonth}
                    currentStep={currentStep}
                    onChangeInvoices={handleChangeInvoices}
                    onValidateStep={validateStep}
                />
            )}
            {confirmationModal}
        </Wizard>
    );
};

export default UpdatePaymentsWizard;
