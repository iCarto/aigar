import React from "react";
import {SortedPaginatedTable, LinkCellTable} from "components/common/table";

class MonthlyInvoicingTable extends React.Component {
    render() {
        if (this.props.membersMonthInfo) {
            const columns = [
                {
                    Header: "Listado de facturación",
                    columns: [
                        {
                            Header: "Usuario",
                            accessor: "nombre_socio",
                            Cell: LinkCellTable,
                            getProps: () => ({
                                handleClick: this.props.handleSelectMember,
                                linkAccessor: "num_socio",
                            }),
                        },
                        {
                            Header: "Sector",
                            accessor: "sector_socio",
                        },
                        {
                            Header: "Tipo",
                            accessor: "tipo_socio",
                        },
                        {
                            Header: "Lectura",
                            accessor: "lectura",
                            Cell: LinkCellTable,
                            getProps: () => ({
                                handleClick: this.props.handleSelectInvoice,
                                linkAccessor: "num_factura",
                            }),
                        },
                        {
                            Header: "Importe",
                            accessor: "importe",
                            Cell: LinkCellTable,
                            getProps: () => ({
                                handleClick: this.props.handleSelectInvoice,
                                linkAccessor: "num_factura",
                            }),
                        },
                        {
                            Header: "Estado",
                            accessor: "estado",
                        },
                        {
                            Header: "Mora",
                            accessor: "mora",
                        },
                    ],
                },
            ];

            return (
                <SortedPaginatedTable
                    columns={columns}
                    data={this.props.membersMonthInfo}
                />
            );
        }
        return null;
    }
}

export default MonthlyInvoicingTable;
