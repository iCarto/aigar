import {useState} from "react";
import {ESTADOS_FACTURA} from "invoice/model";
import {useMonthlyInvoicingTableColumns} from "monthlyinvoicing/data";
import {InvoiceService} from "invoice/service";
import {useMarkInvoiceAsPaidHook, useItemToInvoicesHook} from "invoice/hooks";

import {EntityListPage} from "base/entity/components/presentational";
import {MonthlyInvoicingFilterForm} from ".";
import GroupsIcon from "@mui/icons-material/Groups";
import ConstructionIcon from "@mui/icons-material/Construction";

const ListMonthlyInvoicesPage = ({invoices, handleFilterChange, refreshTable}) => {
    const [selectedTableRows, setSelectedTableRows] = useState([]);
    const [invoicesToUpdateIds, setInvoicesToUpdateIds] = useState([]);

    const {tableColumns} = useMonthlyInvoicingTableColumns();

    const {tableAction: markAsPaidAction, modal: markAsPaidModal} =
        useMarkInvoiceAsPaidHook(null, invoicesToUpdateIds);

    const addNonAttendancePenalty = useItemToInvoicesHook({
        invoiceItemName: "penalización por inasistencia a asamblea",
        invoiceItemIcon: <GroupsIcon />,
        actionToPerform: InvoiceService.addNonAttendancePenalty,
        invoicesToUpdate: invoicesToUpdateIds,
        refreshTable: refreshTable,
    });

    const addWorkingDayPenalty = useItemToInvoicesHook({
        invoiceItemName: "penalización por inasistencia a jornada de trabajo",
        invoiceItemIcon: <ConstructionIcon />,
        actionToPerform: InvoiceService.addWorkingDayPenalty,
        invoicesToUpdate: invoicesToUpdateIds,
        refreshTable: refreshTable,
    });

    const tableActions = [
        markAsPaidAction,
        addNonAttendancePenalty.tableAction,
        addWorkingDayPenalty.tableAction,
    ];

    const handleClickOnTableRows = selectedItems => {
        setSelectedTableRows(selectedItems);

        const notPrintedInvoices = selectedItems
            .filter(invoice => invoice.estado === ESTADOS_FACTURA.NUEVA)
            .map(invoice => invoice.id);

        setInvoicesToUpdateIds(notPrintedInvoices);
    };

    return (
        <>
            {markAsPaidModal}
            {addNonAttendancePenalty.modal}
            {addWorkingDayPenalty.modal}
            <EntityListPage
                items={invoices}
                columns={tableColumns}
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
