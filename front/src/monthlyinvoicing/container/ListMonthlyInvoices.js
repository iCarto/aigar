import {useMonthlyInvoicingTableColumns} from "monthlyinvoicing/data";

import {EntityListPage} from "base/entity/components/presentational";
import {MonthlyInvoicingFilterForm} from ".";

const ListMonthlyInvoices = ({invoices, handleFilterChange}) => {
    const {tableColumns} = useMonthlyInvoicingTableColumns();

    return (
        <EntityListPage
            items={invoices}
            columns={tableColumns}
            filterForm={
                <MonthlyInvoicingFilterForm handleFilterChange={handleFilterChange} />
            }
        />
    );
};

export default ListMonthlyInvoices;
