import {useState, useEffect} from "react";
import {createInvoice} from "invoice/model";
import {useUpdatePaymentsTableColumns} from "payment/data";
import {InvoicesListPreview} from "invoice/presentational";
import {Spinner} from "base/ui/other/components";
import Box from "@mui/material/Box";
import {reviewInvoices, clearErrors} from "payment/data/paymentReviewUtils";

const UpdatePaymentsStep1InvoicesTable = ({
    invoices,
    payments,
    invoicingMonth,
    onChangeInvoices,
    onValidateStep,
    paymentType,
}) => {
    useEffect(() => {
        if (!invoices.length) {
            onValidateStep(false);
        } else {
            onValidateStep(true);
            clearErrors(invoices);
            reviewInvoices(payments, invoices);
        }
    }, [invoicingMonth, invoices, payments]);

    const handleUpdatePayment = (row, columnId, value) => {
        const updatedInvoices = invoices.map((invoice, index) => {
            if (invoice.id === row.original.id) {
                const updatedInvoice = createInvoice({
                    ...invoice,
                    [columnId]: value,
                    errors: [],
                });
                return updatedInvoice;
            }
            return invoice;
        });

        onChangeInvoices(updatedInvoices);
    };

    return (
        <Box display="flex" flexDirection="column" justifyContent="space-around">
            {invoices.length ? (
                <>
                    <InvoicesListPreview
                        invoices={invoices}
                        invoicesTableType={paymentType}
                        useTableColumnsHook={useUpdatePaymentsTableColumns}
                        onValidateStep={onValidateStep}
                        removeRow={null}
                        onUpdateData={handleUpdatePayment}
                    />
                </>
            ) : (
                <Spinner message="Cargando recibos" />
            )}
        </Box>
    );
};

export default UpdatePaymentsStep1InvoicesTable;
