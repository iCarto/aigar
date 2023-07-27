import {useMonthlyInvoicingTableColumns} from "monthlyinvoicing/data";

import {EntityListPage} from "base/entity/components/presentational";
import {MonthlyInvoicingFilterForm} from ".";

const ListMonthlyInvoices = ({invoices, handleFilterChange, filter}) => {
    const {tableColumns} = useMonthlyInvoicingTableColumns();

    return invoices?.length ? (
        <EntityListPage
            items={invoices}
            columns={tableColumns}
            filterForm={
                <MonthlyInvoicingFilterForm
                    filter={filter}
                    handleFilterChange={handleFilterChange}
                />
            }
        />
    ) : null;
};

export default ListMonthlyInvoices;
