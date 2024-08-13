import {usePaymentData, usePaymentUI} from "../hooks";
import {PaymentTable, PaymentFilter, ErrorSummary} from "../presentational";
import {MemberViewModal} from "member/presentational";
import {Spinner} from "base/ui/other/components";
import Grid from "@mui/material/Grid";
import {useState} from "react";

const LoadPaymentsStep2PaymentsTable = ({
    invoicingMonthId,
    payments,
    onChangePayments,
    onValidateStep,
}) => {
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [filter, setFilter] = useState({textSearch: "", showOnlyErrors: false});

    const {loading, handleUpdatePayment, totalRegistersWithErrors} = usePaymentData(
        invoicingMonthId,
        payments,
        onChangePayments,
        onValidateStep,
        setFilteredPayments,
        filter
    );

    const {
        handleFilterChange,
        isModalOpen,
        selectedMemberForModal,
        handleClickViewMember,
        handleClickCancelViewMember,
    } = usePaymentUI(setFilter);

    if (loading) {
        return <Spinner message="Verificando pagos" />;
    }
    if (totalRegistersWithErrors >= payments.length) {
        return (
            <ErrorSummary
                totalErrors={totalRegistersWithErrors}
                totalPayments={payments.length}
                message="Todos los registros tienen errores. Compruebe que ha cargado el fichero correcto y vuelva a empezar."
            />
        );
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
