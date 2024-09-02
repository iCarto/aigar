const InvoicingMonthCellTable = ({invoicingMonth, field, member}) => {
    const invoice = member.invoices.find(
        invoice => invoice.mes_facturacion === invoicingMonth
    );
    const value = invoice ? invoice[field] : null;
    return value;
};

const MoraCellTable = ({invoicingMonth, field, member}) => {
    const invoice = member.invoices.find(
        invoice => invoice.mes_facturacion === invoicingMonth
    );
    return invoice?.mora_por_msg;
};

export function useInvoiceStatsTableColumns(invoicingMonths, selectedField, unitClass) {
    let tableColumns = [
        {
            label: "N.º",
            id: "id",
            width: 2,
        },
        {
            label: "Socio/a",
            id: "nombre",
        },
        {
            label: "Sector",
            id: "sector",
        },
    ];

    if (invoicingMonths.length > 0) {
        const recentMonths = invoicingMonths
            .sort((a, b) => b.localeCompare(a))
            .slice(0, 6);

        const invoicingMonthsColumns = recentMonths.map((invoicingMonth, index) => {
            if (selectedField === "mora") {
                return {
                    label:
                        invoicingMonth.substring(4, 6) +
                        "/" +
                        invoicingMonth.substring(0, 4),
                    formatFunction: member => {
                        return (
                            <MoraCellTable
                                invoicingMonth={invoicingMonth}
                                field={selectedField}
                                member={member}
                            />
                        );
                    },
                    // className: unitClass,
                    // style: {textAlign: "center"},
                    width: 10,
                    id: `invoices.${index}.mora_por_msg`,
                };
            }
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
                className: unitClass,
                style: {textAlign: "right"},
                width: 10,
                id: `invoices.${index}.${selectedField}`,
            };
        });
        tableColumns = [...tableColumns, ...invoicingMonthsColumns];
    }
    return tableColumns;
}
