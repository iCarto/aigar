import {SortedPaginatedTable} from "base/table/components";
import {useInvoiceStatsTableColumns} from "stats/data";

const InvoicesStatsList = ({
    invoicesStats,
    totalInvoices,
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
