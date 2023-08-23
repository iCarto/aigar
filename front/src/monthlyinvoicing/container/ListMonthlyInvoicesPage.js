import {useMonthlyInvoicingTableColumns} from "monthlyinvoicing/data";

import {EntityListPage} from "base/entity/components/presentational";
import {MonthlyInvoicingFilterForm} from ".";
import {useMenuGenericDeleteAction} from "base/ui/menu/hooks";

const ListMonthlyInvoicesPage = ({invoices, totalInvoices, handleFilterChange}) => {
    const {tableColumns} = useMonthlyInvoicingTableColumns();
    const {action: deleteAction, dialog: deleteDialog} = useMenuGenericDeleteAction();

    const tableActions = [deleteAction];

    return (
        <>
            {deleteDialog}
            <EntityListPage
                items={invoices}
                totalItems={totalInvoices}
                columns={tableColumns}
                selectAttribute="id_factura"
                filterForm={
                    <MonthlyInvoicingFilterForm
                        handleFilterChange={handleFilterChange}
                    />
                }
                tableActions={tableActions}
            />
        </>
    );
};

export default ListMonthlyInvoicesPage;
