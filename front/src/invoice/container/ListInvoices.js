import {useInvoicesTableColumns} from "../data";
import EntityListPage from "base/entity/components/presentational/EntityListPage";
import InvoicesFilterForm from "./InvoicesFilterForm";

const ListInvoices = ({invoices, totalInvoices, handleFilterChange}) => {
    const {tableColumns} = useInvoicesTableColumns();

    return (
        <EntityListPage
            items={invoices}
            totalItems={totalInvoices}
            columns={tableColumns}
            filterForm={<InvoicesFilterForm handleFilterChange={handleFilterChange} />}
        />
    );
};

export default ListInvoices;
