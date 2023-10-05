import {useState} from "react";
import {useInvoicesTableColumns} from "../data";
import EntityListPage from "base/entity/components/presentational/EntityListPage";
import InvoicesFilterForm from "./InvoicesFilterForm";

const ListInvoices = ({invoices, handleFilterChange}) => {
    const [selectedTableRows, setSelectedTableRows] = useState([]);
    const {tableColumns} = useInvoicesTableColumns();

    const handleClickOnTableRows = selectedItems => {
        setSelectedTableRows(selectedItems);
    };

    return (
        <EntityListPage
            items={invoices}
            columns={tableColumns}
            selectAttribute="id"
            filterForm={<InvoicesFilterForm handleFilterChange={handleFilterChange} />}
            onClickRows={handleClickOnTableRows}
            selectedTableRows={selectedTableRows}
        />
    );
};

export default ListInvoices;
