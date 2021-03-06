import React from "react";
import {SortedPaginatedTable, LinkCellTable} from "components/common/table";
import {
    InvoiceStatusCellTable,
    InvoiceResumenCellTable,
} from "components/invoice/presentation";
import {MemberStatusCellTable} from "components/member/presentation";

class MonthlyInvoicingList extends React.Component {
    render() {
        if (this.props.invoices) {
            const columns = [
                {
                    accessor: "tipo_socio",
                    Cell: MemberStatusCellTable,
                    className: "text-nowrap text-center",
                    getProps: () => ({
                        showOnlyIcons: true,
                    }),
                },
                {
                    Header: "Socio",
                    accessor: "nombre",
                    Cell: LinkCellTable,
                    getProps: () => ({
                        handleClick: this.props.handleClickViewMember,
                        linkAccessor: "num_socio",
                    }),
                },
                {
                    Header: "Sector",
                    accessor: "sector",
                    className: "text-center",
                },
                {
                    Header: "Nº Factura",
                    accessor: "numero",
                    Cell: LinkCellTable,
                    className: "text-center",
                    getProps: () => ({
                        handleClick: this.props.handleClickViewInvoice,
                        linkAccessor: "id_factura",
                    }),
                },
                {
                    Header: "Lectura",
                    accessor: "consumo",
                    className: "cubic-metre",
                },
                {
                    Header: "Importe",
                    accessor: "total",
                    className: "dollar font-weight-bold",
                },
                {
                    Header: "Estado",
                    accessor: "estado",
                    className: "text-center",
                    Cell: InvoiceStatusCellTable,
                },
                {
                    Header: "Meses previos",
                    accessor: "resumen",
                    className: "text-center",
                    Cell: InvoiceResumenCellTable,
                },
            ];

            return (
                <SortedPaginatedTable
                    columns={columns}
                    data={this.props.invoices}
                    total={this.props.invoicesLength}
                    listView={this.props.listView}
                    handleChangeListView={this.props.handleChangeListView}
                />
            );
        }
        return null;
    }
}

export default MonthlyInvoicingList;
