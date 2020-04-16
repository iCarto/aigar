import React from "react";
import {SortedPaginatedTable} from "components/common/table";
import {Spinner} from "components/common";

const InvoicingMonthCellTable = ({row, column, cell}) => {
    const invoice = row.original.invoices.find(
        invoice => invoice.mes_facturacion === column.getProps().invoicingMonth
    );
    const value = invoice ? invoice[column.getProps().field] : null;
    return <div>{value}</div>;
};

class InvoicesStatsList extends React.Component {
    render() {
        if (this.props.invoicesStats) {
            let columns = [
                {
                    Header: "Número",
                    accessor: "num_socio",
                },
                {
                    Header: "Nombre",
                    accessor: "nombre",
                },
                {
                    Header: "Sector",
                    accessor: "sector",
                },
            ];
            if (this.props.invoicingMonths.length > 0) {
                const invoicingMonthsColumns = this.props.invoicingMonths.map(
                    invoicingMonth => {
                        return {
                            Header:
                                invoicingMonth.substring(4, 6) +
                                "/" +
                                invoicingMonth.substring(0, 4),
                            Cell: InvoicingMonthCellTable,
                            getProps: () => ({
                                invoicingMonth: invoicingMonth,
                                field: this.props.selectedField,
                            }),
                        };
                    }
                );
                columns = [...columns, ...invoicingMonthsColumns];
            }

            return (
                <SortedPaginatedTable
                    columns={columns}
                    data={this.props.invoicesStats}
                    handleChangePageIndex={this.props.handleChangePageIndex}
                />
            );
        }
        return <Spinner message="Cargando datos" />;
    }
}

export default InvoicesStatsList;