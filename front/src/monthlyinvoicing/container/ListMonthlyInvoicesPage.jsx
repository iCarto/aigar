import {ESTADOS_FACTURA} from "invoice/model";
import {useMonthlyInvoicingTableColumns} from "monthlyinvoicing/data";
import {InvoiceService} from "invoice/service";
import {useItemToInvoicesHook} from "invoice/hooks";

import {EntityListPage} from "base/entity/components/presentational";
import {MonthlyInvoicingFilterForm} from ".";
import GroupsIcon from "@mui/icons-material/Groups";
import ConstructionIcon from "@mui/icons-material/Construction";

const ListMonthlyInvoicesPage = ({
    invoices,
    selectedTableRows,
    onFilterChange,
    onClickTableRows,
    refreshTable,
}) => {
    const {tableColumns} = useMonthlyInvoicingTableColumns();

    const notPrintedInvoicesIds = selectedTableRows
        ?.filter(invoice => invoice.estado === ESTADOS_FACTURA.NUEVA)
        .map(invoice => invoice.id);

    const addNonAttendancePenalty = useItemToInvoicesHook({
        invoiceItemName: "penalización por inasistencia a asamblea",
        invoiceItemIcon: <GroupsIcon />,
        actionToPerform: InvoiceService.addNonAttendancePenalty,
        isActionDisabled: !notPrintedInvoicesIds.length,
        invoicesToUpdate: notPrintedInvoicesIds,
        refreshTable: refreshTable,
    });

    const addWorkingDayPenalty = useItemToInvoicesHook({
        invoiceItemName: "penalización por inasistencia a jornada de trabajo",
        invoiceItemIcon: <ConstructionIcon />,
        actionToPerform: InvoiceService.addWorkingDayPenalty,
        isActionDisabled: !notPrintedInvoicesIds.length,
        invoicesToUpdate: notPrintedInvoicesIds,
        refreshTable: refreshTable,
    });

    const tableActions = [
        addNonAttendancePenalty.tableAction,
        addWorkingDayPenalty.tableAction,
    ];

    const handleClickTableRows = selectedItems => {
        onClickTableRows(selectedItems);
    };

    return (
        <>
            {addNonAttendancePenalty.modal}
            {addWorkingDayPenalty.modal}
            <EntityListPage
                items={invoices}
                columns={tableColumns}
                filterForm={
                    <MonthlyInvoicingFilterForm handleFilterChange={onFilterChange} />
                }
                tableActions={tableActions}
                onClickRows={handleClickTableRows}
                selectedTableRows={selectedTableRows}
            />
        </>
    );
};

export default ListMonthlyInvoicesPage;
