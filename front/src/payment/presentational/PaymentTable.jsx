import {LoadDataTable} from "loaddata/presentational";
import {useLoadPaymentsTableColumns} from "payment/data";
import {MemberViewModal} from "member/presentational";
import {usePaymentUI} from "../hooks";
import {useState, useEffect} from "react";
import {useFilterMonthlyData} from "monthlyinvoicing/hooks";
import {
    PaymentFilter,
    ErrorSummary,
    PreviewInvoiceTableErrors,
} from "payment/presentational";

import {getTotalErrors} from "payment/model";

export const PaymentTable = ({
    payments,
    invoicingMonthId,
    onChangePayments,
    onValidateStep,
    onUpdateData,
    removeRow,
}) => {
    const [loading, setLoading] = useState(false);

    const [filter, setFilter] = useState({textSearch: "", showOnlyErrors: false});

    const {
        handleFilterChange,
        isModalOpen,
        selectedMemberForModal,
        handleClickViewMember,
        handleClickCancelViewMember,
    } = usePaymentUI(setFilter);

    useEffect(() => {
        // https://stackoverflow.com/questions/62336340/
        if (getTotalErrors(payments)) {
            onValidateStep(false);
        } else {
            onValidateStep(true);
        }
    }, [payments]);

    const {filterMonthlyData} = useFilterMonthlyData();
    const filteredPayments = payments ? filterMonthlyData(payments, filter) : [];

    const displayAlerts = payments.some(item => item.errors.length);
    const {tableColumns} = useLoadPaymentsTableColumns(
        handleClickViewMember,
        displayAlerts,
        removeRow
    );
    const modal = (
        <MemberViewModal
            id={selectedMemberForModal}
            isOpen={isModalOpen}
            onClose={handleClickCancelViewMember}
        />
    );

    if (!payments.length) {
        return null;
    }

    const totalItemsWithErrors = getTotalErrors(payments);

    if (totalItemsWithErrors >= payments.length) {
        return (
            <ErrorSummary
                totalErrors={totalItemsWithErrors}
                totalPayments={payments.length}
                message="Todos los registros tienen errores. Compruebe que ha cargado el fichero correcto y vuelva a empezar."
            />
        );
    }

    return (
        <>
            <PreviewInvoiceTableErrors
                invoices={payments}
                onValidateStep={onValidateStep}
            />
            <PaymentFilter filter={filter} onChange={handleFilterChange} />
            <LoadDataTable
                columns={tableColumns}
                items={filteredPayments}
                onUpdateData={onUpdateData}
            />
            {modal}
        </>
    );
};
