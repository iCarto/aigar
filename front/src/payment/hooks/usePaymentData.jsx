import {useState, useEffect} from "react";
import {InvoicingMonthService} from "monthlyinvoicing/service";
import {MemberService} from "member/service";
import {LoadDataValidatorService} from "validation/service";
import {createPayment} from "payment/model";
import {useFilterMonthlyData} from "monthlyinvoicing/hooks";

export const usePaymentData = (
    invoicingMonthId,
    payments,
    onChangePayments,
    onValidateStep
) => {
    const [invoices, setInvoices] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState({textSearch: "", showOnlyErrors: false});

    const {filterMonthlyData} = useFilterMonthlyData();

    useEffect(() => {
        setLoading(true);
        InvoicingMonthService.getInvoicingMonthInvoices(invoicingMonthId)
            .then(fetchedInvoices => {
                setInvoices(fetchedInvoices);
                reviewPayments(payments, fetchedInvoices);
            })
            .finally(() => setLoading(false));
    }, [invoicingMonthId]);

    useEffect(() => {
        setFilteredPayments(filterMonthlyData(payments, filter));
    }, [payments, filter]);

    useEffect(() => {
        onValidateStep(!loading);
    }, [loading]);

    const findInvoiceForPayment = (payment, invoices) => {
        let invoiceForPayment = invoices.find(
            invoice => invoice.numero === payment.num_factura
        );

        //TO-DO: Review. This will always return undefined, since payment.member_id comes from the invoice object. If no invoice is found for a payment, then this payment will only have a value for fecha, monto & num_factura. Thus payment.member_id will always be null in these cases.
        if (!invoiceForPayment) {
            invoiceForPayment = invoices.find(
                invoice => invoice.member_id === payment.member_id
            );
        }
        return invoiceForPayment;
    };

    const reviewPayments = async (payments, invoices) => {
        const paymentsWithErrors = await Promise.all(
            payments?.map(async payment => {
                const invoiceForPayment = findInvoiceForPayment(payment, invoices);
                let invoiceFieldsForPayment = {};

                if (invoiceForPayment) {
                    invoiceFieldsForPayment = {
                        member_id: invoiceForPayment.member_id,
                        member_name: invoiceForPayment.nombre,
                        sector: invoiceForPayment.sector,
                        invoice: invoiceForPayment.id,
                    };
                } else {
                    // We need to get the member details for payments without invoice to avoid nulls in the table.
                    const memberId = payment.num_factura.slice(0, 4);
                    const member = await MemberService.getMember(memberId);
                    invoiceFieldsForPayment = {
                        member_id: member.id,
                        member_name: member.name,
                        sector: member.sector,
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
            })
        );

        onChangePayments(paymentsWithErrors);
        onValidateStep(getPaymentsTotalErrors(paymentsWithErrors) === 0 && !loading);
    };

    const handleUpdatePayment = (row, columnId, value) => {
        const updatedPayments = payments.map(payment => {
            if (payment.id === row.original.id) {
                return createPayment({...payment, [columnId]: value});
            }
            return payment;
        });
        reviewPayments(updatedPayments, invoices);
    };

    const getPaymentsTotalErrors = payments => {
        if (!payments) {
            return 0;
        }
        return payments.filter(payment => payment.errors.length !== 0).length;
    };

    const totalRegistersWithErrors = getPaymentsTotalErrors(payments);

    return {
        filteredPayments,
        loading,
        handleUpdatePayment,
        totalRegistersWithErrors,
    };
};
