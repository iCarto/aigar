import {useState} from "react";
import {useMonthlyInvoicingTableColumns} from "monthlyinvoicing/data";

import {useAddNonAttendancePenaltyHook, useMarkInvoiceAsPaidHook} from "invoice/hooks";
import {EntityListPage} from "base/entity/components/presentational";
import {MonthlyInvoicingFilterForm} from ".";

const ListMonthlyInvoicesPage = ({invoices, handleFilterChange}) => {
    const [selectedTableRows, setSelectedTableRows] = useState([]);

    const {tableColumns} = useMonthlyInvoicingTableColumns();
    const {tableAction: markAsPaidAction, modal: markAsPaidModal} =
        useMarkInvoiceAsPaidHook(null, selectedTableRows);
    const {
        tableAction: addNonAttendancePenaltyAction,
        modal: addNonAttendancePenaltyModal,
    } = useAddNonAttendancePenaltyHook(null, selectedTableRows);

    const tableActions = [markAsPaidAction, addNonAttendancePenaltyAction];

    const handleClickOnTableRows = selectedItems => {
        setSelectedTableRows(selectedItems);
    };

    return (
        <>
            {markAsPaidModal}
            {addNonAttendancePenaltyModal}
            <EntityListPage
                items={invoices}
                columns={tableColumns}
                selectAttribute="id"
                filterForm={
                    <MonthlyInvoicingFilterForm
                        handleFilterChange={handleFilterChange}
                    />
                }
                tableActions={tableActions}
                onClickRows={handleClickOnTableRows}
                selectedTableRows={selectedTableRows}
            />
        </>
    );
};

export default ListMonthlyInvoicesPage;
