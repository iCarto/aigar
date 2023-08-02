import {useMonthlyInvoicingTableColumns} from "monthlyinvoicing/data";

import {EntityListPage} from "base/entity/components/presentational";
import {MonthlyInvoicingFilterForm} from ".";

const ListMonthlyInvoicesPage = ({invoices, totalInvoices, handleFilterChange}) => {
    const {tableColumns} = useMonthlyInvoicingTableColumns();

    return (
        <EntityListPage
            items={invoices}
            totalItems={totalInvoices}
            columns={tableColumns}
            filterForm={
                <MonthlyInvoicingFilterForm handleFilterChange={handleFilterChange} />
            }
        />
    );
};

export default ListMonthlyInvoicesPage;
