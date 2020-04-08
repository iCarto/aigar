import React from "react";
import {SortedPaginatedTable, LinkCellTable} from "components/common/table";
import {Spinner} from "components/common";

class InvoicesList extends React.Component {
    render() {
        console.log("InvoicesList.render");
        if (this.props.invoices) {
            const columns = [
                {
                    Header: "Número",
                    accessor: "numero",
                    Cell: LinkCellTable,
                    getProps: () => ({
                        handleClick: this.props.handleClickViewInvoice,
                        linkAccessor: "id_factura",
                    }),
                },
                {
                    Header: "Nombre",
                    accessor: "nombre",
                },
                {
                    Header: "Sector",
                    accessor: "sector",
                },
                {
                    Header: "Caudal anterior",
                    accessor: "caudal_anterior",
                },
                {
                    Header: "Consumo",
                    accessor: "consumo",
                },
                {
                    Header: "Caudal actual",
                    accessor: "caudal_actual",
                },
                {
                    Header: "Cuota fija",
                    accessor: "cuota_fija",
                },
                {
                    Header: "Cuota variable",
                    accessor: "cuota_variable",
                },
                {
                    Header: "Comisión",
                    accessor: "comision",
                },
                {
                    Header: "Ahorro",
                    accessor: "ahorro",
                },
                {
                    Header: "Derecho",
                    accessor: "derecho",
                },
                {
                    Header: "Reconexión",
                    accessor: "reconexion",
                },
                {
                    Header: "Total",
                    accessor: "total",
                },
            ];

            return (
                <SortedPaginatedTable
                    columns={columns}
                    data={this.props.invoices}
                    selectedPageIndex={this.props.selectedPageIndex}
                    handleChangePageIndex={this.props.handleChangePageIndex}
                />
            );
        }
        return <Spinner message="Cargando datos" />;
    }
}

export default InvoicesList;
