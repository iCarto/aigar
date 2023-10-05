const InvoicingMonthCellTable = ({invoicingMonth, field, member}) => {
    const invoice = member.invoices.find(
        invoice => invoice.mes_facturacion === invoicingMonth
    );
    const value = invoice ? invoice[field] : null;
    return value;
};

export function useInvoiceStatsTableColumns(invoicingMonths, selectedField, unitClass) {
    let tableColumns = [
        {
            label: "N.º",
            id: "id",
        },
        {
            label: "Socio",
            id: "nombre",
        },
        {
            label: "Sector",
            id: "sector",
        },
    ];

    if (invoicingMonths.length > 0) {
        const invoicingMonthsColumns = invoicingMonths.map(invoicingMonth => {
            return {
                label:
                    invoicingMonth.substring(4, 6) +
                    "/" +
                    invoicingMonth.substring(0, 4),
                formatFunction: member => {
                    return (
                        <InvoicingMonthCellTable
                            invoicingMonth={invoicingMonth}
                            field={selectedField}
                            member={member}
                        />
                    );
                },
                id: selectedField,
                className: unitClass,
                style: {textAlign: "right"},
            };
        });
        tableColumns = [...tableColumns, ...invoicingMonthsColumns];
    }
    return tableColumns;
}
