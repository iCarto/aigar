import {SortedPaginatedTable} from "base/table";
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
        <SortedPaginatedTable
            columns={columns}
            data={invoicesStats}
            totalItems={totalInvoices}
        />
    ) : null;
};

export default InvoicesStatsList;
