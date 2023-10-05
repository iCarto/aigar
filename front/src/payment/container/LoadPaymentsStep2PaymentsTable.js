import {useState, useEffect} from "react";
import {LoadDataValidatorService} from "validation/service";
import {InvoicingMonthService} from "monthlyinvoicing/service";
import {createPayment} from "payment/model";
import {useFilterMonthlyData} from "monthlyinvoicing/hooks";

import {LoadPaymentsList} from "../presentational";
import {LoadDataTableFilter} from "loaddata/presentational";
import {Spinner} from "base/common";
import Alert from "@mui/material/Alert";

const LoadPaymentsStep2PaymentsTable = ({
    id_mes_facturacion,
    payments,
    onChangePayments,
    onValidateStep,
}) => {
    const [invoices, setInvoices] = useState([]);
    const [filter, setFilter] = useState({
        text: "",
        showOnlyErrors: false,
    });
    const [loading, setLoading] = useState(false);

    const {filterMonthlyData} = useFilterMonthlyData();

    useEffect(() => {
        setLoading(true);
        InvoicingMonthService.getInvoicingMonthInvoices(id_mes_facturacion).then(
            invoices => {
                setInvoices(invoices);
                reviewPayments(payments, invoices);
                setLoading(false);
            }
        );
    }, [id_mes_facturacion]);

    const handleUpdatePayment = (rowId, columnId, value) => {
        const updatedPayments = payments.map(payment => {
            if (payment.id === rowId) {
                const updatedPayment = createPayment({
                    ...payment,
                    [columnId]: value,
                });
                return updatedPayment;
            }
            return payment;
        });
        reviewPayments(updatedPayments, invoices);
    };

    const getPaymentsTotalErrors = payments => {
        return payments.filter(payment => payment.errors.length !== 0).length;
    };

    const findInvoiceForPayment = (payment, invoices) => {
        let invoiceForPayment = invoices.find(
            invoice => invoice.numero === payment.num_factura
        );
        if (!invoiceForPayment) {
            invoiceForPayment = invoices.find(
                invoice => invoice.member_id === payment.member_id
            );
        }
        return invoiceForPayment;
    };

    const reviewPayments = (payments, invoices) => {
        const paymentsWithErrors = payments?.map(payment => {
            const invoiceForPayment = findInvoiceForPayment(payment, invoices);
            let invoiceFieldsForPayment = {};
            if (invoiceForPayment) {
                invoiceFieldsForPayment = {
                    member_id: invoiceForPayment.member_id,
                    member_name: invoiceForPayment.nombre,
                    sector: invoiceForPayment.sector,
                    id_factura: invoiceForPayment.id,
                };
            }
            return createPayment({
                ...payment,
                ...invoiceFieldsForPayment,
                errors: LoadDataValidatorService.validatePaymentEntry(
                    payment,
                    invoiceForPayment
                ),
            });
        });
        onChangePayments(paymentsWithErrors);
        console.log(getPaymentsTotalErrors(paymentsWithErrors) === 0);
        onValidateStep(getPaymentsTotalErrors(paymentsWithErrors) === 0 && !loading);
    };

    const handleFilterChange = newFilter => {
        setFilter(prevFilter => ({
            ...prevFilter,
            ...newFilter,
        }));
    };

    const totalRegistersWithErrors = getPaymentsTotalErrors(payments);

    const errorsMessage = (
        <Alert severity="error" sx={{mb: 1}}>
            Existen <strong>{totalRegistersWithErrors}</strong> registros con error de
            un total de <strong>{payments.length}</strong> registros leídos.
        </Alert>
    );

    if (loading) {
        onValidateStep(false);
        return <Spinner message="Verificando pagos" />;
    }

    if (payments.length) {
        const paymentsFiltered = filterMonthlyData(payments, filter);

        return (
            <div className="d-flex flex-column justify-content-around">
                {totalRegistersWithErrors ? errorsMessage : null}
                <LoadDataTableFilter filter={filter} onChange={handleFilterChange} />
                <LoadPaymentsList
                    payments={paymentsFiltered}
                    onUpdatePayment={handleUpdatePayment}
                />
            </div>
        );
    }
};

export default LoadPaymentsStep2PaymentsTable;
