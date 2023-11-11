import {useState, useEffect} from "react";

import {createInvoice} from "invoice/model";
import {useUpdatePaymentsTableColumns} from "payment/data";
import {useFilterMonthlyData} from "monthlyinvoicing/hooks";
import {MemberViewModal} from "member/presentational";
import {LoadDataTable, LoadDataTableFilter} from "loaddata/presentational";
import {ErrorMessage} from "base/error/components";
import {Spinner} from "base/ui/other/components";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const UpdatePaymentsStep1InvoicesTable = ({
    invoices,
    payments,
    invoicingMonth,
    onChangeInvoices,
    onValidateStep,
    paymentType,
}) => {
    const [filter, setFilter] = useState({
        text: "",
        showOnlyErrors: false,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMemberForModal, setSelectedMemberForModal] = useState(null);
    const [totalInvoicesWithErrors, setTotalInvoicesWithErrors] = useState(0);

    const {filterMonthlyData} = useFilterMonthlyData();

    const handleClickViewMember = member_id => {
        setIsModalOpen(true);
        setSelectedMemberForModal(member_id);
    };

    const onClickCancelViewMember = () => {
        setIsModalOpen(false);
        setSelectedMemberForModal(null);
    };

    const isInvoicesWithErrors = invoices.some(invoice => invoice.errors.length);

    const {tableColumns} = useUpdatePaymentsTableColumns(
        handleClickViewMember,
        paymentType,
        isInvoicesWithErrors
    );

    const filteredInvoices = invoices ? filterMonthlyData(invoices, filter) : [];

    useEffect(() => {
        if (!invoices.length) onValidateStep(false);
        else {
            onValidateStep(true);
            reviewInvoices(payments, invoices);

            const invoicesWithErrors = invoices.filter(
                invoice => invoice.errors.length !== 0
            );
            setTotalInvoicesWithErrors(invoicesWithErrors.length);
        }
    }, [invoicingMonth, invoices, payments]);

    const reviewInvoices = (payments, invoices) => {
        invoices.forEach(invoice => {
            checkPaymentsForInvoice(payments, invoice);
        });
    };

    const checkPaymentsForInvoice = (payments, invoice) => {
        const paymentsForInvoice = payments.filter(
            payment => invoice.numero === payment.num_factura
        );

        const errorMessages = {
            multiplePayments: "El recibo tiene varios pagos. ",
            paymentsDoNotCoverTotal: "Los pagos no cubren el total del recibo.",
            paymentsExceedTotal: "Los pagos superan el total del recibo.",
        };

        if (paymentsForInvoice.length) {
            if (paymentsForInvoice.length > 1) {
                if (!invoice.errors.includes(errorMessages.multiplePayments))
                    invoice.errors.push(errorMessages.multiplePayments);
            }
            if (invoice.total > invoice.ontime_payment + invoice.late_payment) {
                if (!invoice.errors.includes(errorMessages.paymentsDoNotCoverTotal))
                    invoice.errors.push(errorMessages.paymentsDoNotCoverTotal);
            }
            if (invoice.total < invoice.ontime_payment + invoice.late_payment) {
                if (!invoice.errors.includes(errorMessages.paymentsExceedTotal))
                    invoice.errors.push(errorMessages.paymentsExceedTotal);
            }
        }
    };

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

    const handleFilterChange = newFilter => {
        setFilter(prevFilter => ({
            ...prevFilter,
            ...newFilter,
        }));
    };

    const errorMessage = (
        <Typography>
            Existen <strong>{totalInvoicesWithErrors}</strong> recibos con alertas que
            debería revisar.
        </Typography>
    );

    const modal = (
        <MemberViewModal
            id={selectedMemberForModal}
            isOpen={isModalOpen}
            onClose={onClickCancelViewMember}
        />
    );

    return (
        <Box display="flex" flexDirection="column" justifyContent="space-around">
            {invoices.length ? (
                <>
                    {totalInvoicesWithErrors ? (
                        <ErrorMessage message={errorMessage} />
                    ) : null}
                    <LoadDataTableFilter
                        filter={filter}
                        onChange={handleFilterChange}
                    />
                    <LoadDataTable
                        items={filteredInvoices}
                        columns={tableColumns}
                        onUpdateData={handleUpdatePayment}
                    />
                    {modal}
                </>
            ) : (
                <Spinner message="Cargando recibos" />
            )}
        </Box>
    );
};

export default UpdatePaymentsStep1InvoicesTable;
