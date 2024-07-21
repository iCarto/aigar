import {useState, useEffect} from "react";

import {InvoicingMonthService} from "monthlyinvoicing/service";
import {useFilterMonthlyData} from "monthlyinvoicing/hooks";
import {LoadDataTableFilter} from "loaddata/presentational";
import {InvoicesListPreview} from "invoice/presentational";
import {ErrorMessage} from "base/error/components";
import {Spinner} from "base/ui/other/components";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const LoadPaymentsStep3InvoicesTable = ({
    payments,
    invoices,
    invoicingMonthId,
    onChangeInvoices,
    onValidateStep,
}) => {
    const [filter, setFilter] = useState({
        text: "",
        showOnlyErrors: false,
    });

    const {filterMonthlyData} = useFilterMonthlyData();

    const filteredInvoices = invoices ? filterMonthlyData(invoices, filter) : [];

    useEffect(() => {
        if (!invoices.length) {
            onValidateStep(false);
        }
        InvoicingMonthService.previewInvoicesWithPayments(payments)
            .then(fetchedInvoices => {
                reviewInvoices(payments, fetchedInvoices);
                onChangeInvoices(fetchedInvoices);
                onValidateStep(true);
            })
            .catch(error => {
                console.log(error);
                onValidateStep(false);
            });
    }, [invoicingMonthId]);

    const reviewInvoices = (payments, invoices) => {
        invoices.forEach(invoice => {
            checkPaymentsForInvoice(payments, invoice);
        });
    };

    const checkPaymentsForInvoice = (payments, invoice) => {
        const paymentsForInvoice = payments.filter(
            payment => invoice.numero === payment.num_factura
        );

        if (paymentsForInvoice.length !== 0) {
            if (paymentsForInvoice.length > 1) {
                invoice.errors.push("El recibo tiene varios pagos");
                return;
            }
            if (invoice.total > invoice.ontime_payment + invoice.late_payment) {
                invoice.errors.push("El pago no cubre el total");
            }
            if (invoice.total < invoice.ontime_payment + invoice.late_payment) {
                invoice.errors.push("El pago supera el total");
            }
        }
    };

    const handleFilterChange = newFilter => {
        setFilter(prevFilter => ({
            ...prevFilter,
            ...newFilter,
        }));
    };

    const getTotalErrors = items => {
        return items.filter(item => item.errors.length !== 0).length;
    };

    const totalInvoicesWithErrors = getTotalErrors(invoices);

    const errorsMessage = (
        <Typography>
            Existen <strong>{totalInvoicesWithErrors}</strong> recibos con alertas que
            debería revisar.
        </Typography>
    );

    return (
        <Box display="flex" flexDirection="column" justifyContent="space-around">
            {invoices.length ? (
                <>
                    {totalInvoicesWithErrors ? (
                        <ErrorMessage message={errorsMessage} />
                    ) : null}
                    <LoadDataTableFilter
                        filter={filter}
                        onChange={handleFilterChange}
                    />
                    <InvoicesListPreview
                        invoices={filteredInvoices}
                        invoicesTableType="payments"
                    />
                </>
            ) : (
                <Spinner message="Cargando recibos" />
            )}
        </Box>
    );
};

export default LoadPaymentsStep3InvoicesTable;
