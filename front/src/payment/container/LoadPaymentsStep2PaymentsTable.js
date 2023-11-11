import {useState, useEffect} from "react";
import {LoadDataValidatorService} from "validation/service";
import {InvoicingMonthService} from "monthlyinvoicing/service";
import {MemberService} from "member/service";
import {createPayment} from "payment/model";
import {useFilterMonthlyData} from "monthlyinvoicing/hooks";
import {useLoadPaymentsTableColumns} from "payment/data";

import {MemberViewModal} from "member/presentational";
import {LoadDataTable, LoadDataTableFilter} from "loaddata/presentational";
import {ErrorMessage} from "base/error/components";
import {Spinner} from "base/ui/other/components";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const LoadPaymentsStep2PaymentsTable = ({
    invoicingMonthId,
    payments,
    onChangePayments,
    onValidateStep,
}) => {
    const [invoices, setInvoices] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMemberForModal, setSelectedMemberForModal] = useState(null);
    const [filter, setFilter] = useState({
        textSearch: "",
        showOnlyErrors: false,
    });
    const [loading, setLoading] = useState(false);

    const {filterMonthlyData} = useFilterMonthlyData();

    useEffect(() => {
        setLoading(true);
        InvoicingMonthService.getInvoicingMonthInvoices(invoicingMonthId)
            .then(invoices => {
                setInvoices(invoices);
                reviewPayments(payments, invoices);
            })
            .finally(() => setLoading(false));
    }, [invoicingMonthId]);

    useEffect(() => {
        setFilteredPayments(filterMonthlyData(payments, filter));
    }, [payments, filter]);

    useEffect(() => {
        if (loading) onValidateStep(false);
        else onValidateStep(true);
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
        const updatedPayments = payments.map((payment, index) => {
            if (payment.id === row.original.id) {
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

    const handleClickViewMember = member_id => {
        setIsModalOpen(true);
        setSelectedMemberForModal(member_id);
    };

    const handleClickCancelViewMember = () => {
        setIsModalOpen(false);
        setSelectedMemberForModal(null);
    };

    const handleFilterChange = newFilter => {
        setFilter(prevFilter => ({
            ...prevFilter,
            ...newFilter,
        }));
    };

    const getPaymentsTotalErrors = payments => {
        return payments.filter(payment => payment.errors.length !== 0).length;
    };

    const {tableColumns} = useLoadPaymentsTableColumns(handleClickViewMember);

    const totalRegistersWithErrors = getPaymentsTotalErrors(payments);

    const modal = (
        <MemberViewModal
            id={selectedMemberForModal}
            isOpen={isModalOpen}
            onClose={handleClickCancelViewMember}
        />
    );

    const errorsMessage = (
        <Typography>
            Existen <strong>{totalRegistersWithErrors}</strong> registros con error de
            un total de <strong>{payments.length}</strong> registros leídos.
        </Typography>
    );

    return loading ? (
        <Spinner message="Verificando pagos" />
    ) : (
        <Grid>
            {totalRegistersWithErrors ? <ErrorMessage message={errorsMessage} /> : null}
            <LoadDataTableFilter filter={filter} onChange={handleFilterChange} />
            <LoadDataTable
                items={filteredPayments}
                columns={tableColumns}
                onUpdateData={handleUpdatePayment}
            />
            {modal}
        </Grid>
    );
};

export default LoadPaymentsStep2PaymentsTable;
