const InvoicingMonthCellTable = ({row, column}) => {
    const invoice = row.original.invoices.find(
        invoice => invoice.mes_facturacion === column.invoicingMonth
    );
    const value = invoice ? invoice[column.field] : null;
    return <div className={column.className}>{value}</div>;
};

export function useInvoiceStatsTableColumns(invoicingMonths, selectedField, unitClass) {
    let tableColumns = [
        {
            Header: "Número",
            accessor: "num_socio",
        },
        {
            Header: "Socio",
            accessor: "nombre",
            style: {minWidth: "210px"},
        },
        {
            Header: "Sector",
            accessor: "sector",
        },
    ];
    if (invoicingMonths.length > 0) {
        const invoicingMonthsColumns = invoicingMonths.map(invoicingMonth => {
            return {
                Header:
                    invoicingMonth.substring(4, 6) +
                    "/" +
                    invoicingMonth.substring(0, 4),
                Cell: InvoicingMonthCellTable,
                invoicingMonth: invoicingMonth,
                field: selectedField,
                className: unitClass,
            };
        });
        tableColumns = [...tableColumns, ...invoicingMonthsColumns];
    }
    return tableColumns;
}
