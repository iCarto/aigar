import {usePaymentData, usePaymentUI} from "../hooks";
import {PaymentTable, PaymentFilter, ErrorSummary} from "../presentational";
import {MemberViewModal} from "member/presentational";
import {Spinner} from "base/ui/other/components";
import Grid from "@mui/material/Grid";

const LoadPaymentsStep2PaymentsTable = ({
    invoicingMonthId,
    payments,
    onChangePayments,
    onValidateStep,
}) => {
    const {filteredPayments, loading, handleUpdatePayment, totalRegistersWithErrors} =
        usePaymentData(invoicingMonthId, payments, onChangePayments, onValidateStep);

    const {
        filter,
        handleFilterChange,
        isModalOpen,
        selectedMemberForModal,
        handleClickViewMember,
        handleClickCancelViewMember,
    } = usePaymentUI();

    if (loading) {
        return <Spinner message="Verificando pagos" />;
    }

    return (
        <Grid>
            <ErrorSummary
                totalErrors={totalRegistersWithErrors}
                totalPayments={payments.length}
            />
            <PaymentFilter filter={filter} onChange={handleFilterChange} />
            <PaymentTable
                payments={filteredPayments}
                onUpdatePayment={handleUpdatePayment}
                onViewMember={handleClickViewMember}
            />
            <MemberViewModal
                id={selectedMemberForModal}
                isOpen={isModalOpen}
                onClose={handleClickCancelViewMember}
            />
        </Grid>
    );
};

export default LoadPaymentsStep2PaymentsTable;
