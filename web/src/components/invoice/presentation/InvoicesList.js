import React from "react";
import {SortedPaginatedTable, LinkCellTable} from "components/common/table";
import {Spinner} from "components/common";
import InvoiceGroupFieldsCellTable from "./InvoiceGroupFieldsCellTable";
import InvoiceStatusCellTable from "./InvoiceStatusCellTable";
import InvoiceMonthCellTable from "./InvoiceMonthCellTable";

class InvoicesList extends React.Component {
    render() {
        console.log("InvoicesList.render");
        if (this.props.invoices) {
            const columns = [
                {
                    Header: "Mes",
                    accessor: "mes_facturacion",
                    Cell: InvoiceMonthCellTable,
                },
                {
                    Header: "Caudal anterior",
                    accessor: "caudal_anterior",
                    className: "cubic-metre",
                },
                {
                    Header: "Caudal actual",
                    accessor: "caudal_actual",
                    className: "cubic-metre",
                },
                {
                    Header: "Consumo",
                    accessor: "consumo",
                    className: "cubic-metre",
                },
                {
                    Header: "Mora",
                    accessor: "mora",
                    className: "dollar",
                },
                {
                    Header: "Otros",
                    Cell: InvoiceGroupFieldsCellTable,
                },
                {
                    Header: "Total",
                    accessor: "total",
                    className: "dollar font-weight-bold",
                },
                {
                    Header: "Estado",
                    accessor: "estado",
                    Cell: InvoiceStatusCellTable,
                },
            ];
            if (this.props.showLink === false) {
                columns.splice(0, 0, {
                    Header: "Número",
                    accessor: "numero",
                });
            } else {
                columns.splice(0, 0, {
                    Header: "Número",
                    accessor: "numero",
                    Cell: LinkCellTable,
                    getProps: () => ({
                        handleClick: this.props.handleClickViewInvoice,
                        linkAccessor: "id_factura",
                    }),
                });
            }
            if (this.props.showMember !== false) {
                const memberColumns = [
                    {
                        Header: "Nombre",
                        accessor: "nombre",
                        className: "font-weight-bold text-nowrap",
                    },
                    {
                        Header: "Sector",
                        accessor: "sector",
                    },
                ];
                columns.splice(1, 0, ...memberColumns);
            }

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
        return <Spinner message="Cargando datos" />;
    }
}

export default InvoicesList;
