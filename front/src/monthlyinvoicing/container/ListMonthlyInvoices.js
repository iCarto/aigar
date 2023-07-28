import {useMonthlyInvoicingTableColumns} from "monthlyinvoicing/data";
import EntityListPage from "base/entity/components/presentational/EntityListPage";
import {MonthlyInvoicingFilterForm} from ".";

const ListMonthlyInvoices = ({
    invoices,
    listView,
    handleChangeListView,
    handleFilterChange,
    filter,
}) => {
    const {tableColumns} = useMonthlyInvoicingTableColumns();

    return invoices?.length ? (
        <EntityListPage
            items={invoices}
            columns={tableColumns}
            listView={listView}
            filterForm={
                <MonthlyInvoicingFilterForm
                    filter={filter}
                    handleFilterChange={handleFilterChange}
                />
            }
            handleChangeListView={handleChangeListView}
        />
    ) : null;
};

export default ListMonthlyInvoices;
