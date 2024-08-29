import {useState, useEffect} from "react";
import {SortedEditableTable} from "base/table/components";
import {MemberViewModal} from "member/presentational";
import Box from "@mui/material/Box";
import {LoadDataTableFilter} from "loaddata/presentational";
import {ErrorSummary, PreviewInvoiceTableErrors} from "payment/presentational";
import {useFilterMonthlyData} from "monthlyinvoicing/hooks";
import {getTotalErrors} from "payment/model";
import {usePaymentUI} from "payment/hooks";

const InvoicesListPreview = ({
    invoices,
    invoicesTableType,
    useTableColumnsHook,
    onValidateStep,
    onUpdateData,
    removeRow,
}) => {
    const [filter, setFilter] = useState({
        text: "",
        showOnlyErrors: false,
    });

    const {
        handleFilterChange,
        isModalOpen,
        selectedMemberForModal,
        handleClickViewMember,
        handleClickCancelViewMember,
    } = usePaymentUI(setFilter);

    useEffect(() => {
        // https://stackoverflow.com/questions/62336340/
        if (getTotalErrors(invoices)) {
            onValidateStep(false);
        } else {
            onValidateStep(true);
        }
    }, [invoices]);

    const {filterMonthlyData} = useFilterMonthlyData();
    const filteredInvoices = invoices ? filterMonthlyData(invoices, filter) : [];

    const displayAlerts = invoices.some(invoice => invoice.errors.length);

    const {tableColumns} = useTableColumnsHook(
        handleClickViewMember,
        invoicesTableType,
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
    if (!invoices.length) {
        return null;
    }

    const totalInvoicesWithErrors = getTotalErrors(invoices);
    if (totalInvoicesWithErrors >= invoices.length) {
        return (
            <ErrorSummary
                totalErrors={totalInvoicesWithErrors}
                totalPayments={invoices.length}
                message="Todos los registros tienen errores. Compruebe que ha cargado el fichero correcto y vuelva a empezar."
            />
        );
    }

    return (
        <>
            <PreviewInvoiceTableErrors
                invoices={invoices}
                onValidateStep={onValidateStep}
            />
            <LoadDataTableFilter filter={filter} onChange={handleFilterChange} />
            <Box sx={{overflow: "auto", maxHeight: "450px"}}>
                <SortedEditableTable
                    columns={tableColumns}
                    data={filteredInvoices}
                    onUpdateData={onUpdateData}
                />
                {modal}
            </Box>
        </>
    );
};

export default InvoicesListPreview;
