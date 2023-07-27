import {SortedPaginatedTable} from "base/table";
import {useInvoiceStatsTableColumns} from "stats/data";

const InvoicesStatsList = ({
    invoicesStats,
    invoicingMonths,
    selectedField,
    unitClass,
}) => {
    const columns = useInvoiceStatsTableColumns(
        invoicingMonths,
        selectedField,
        unitClass
    );

    return invoicesStats ? (
        <SortedPaginatedTable columns={columns} data={invoicesStats} />
    ) : null;
};

export default InvoicesStatsList;
