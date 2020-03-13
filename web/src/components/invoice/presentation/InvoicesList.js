import React from "react";
import {SortedPaginatedTable, LinkCellTable} from "components/common/table";
import {Spinner} from "components/common";

class InvoicesList extends React.Component {
    filter(invoices, filter) {
        return invoices.filter(invoice => {
            var filtered = true;
            if (filter) {
                if (filter.numero) {
                    filtered = invoice.numero.indexOf(filter.numero) >= 0;
                }
                if (filter.nombre) {
                    filtered = filtered && invoice.nombre.indexOf(filter.nombre) >= 0;
                }
                if (filter.sector) {
                    filtered = filtered && invoice.sector === parseInt(filter.sector);
                }
            }
            return filtered;
        });
    }
    render() {
        console.log("InvoicesList.render");
        if (this.props.invoices) {
            const columns = [
                {
                    Header: "Listado de facturas",
                    columns: [
                        {
                            Header: "Número",
                            accessor: "numero",
                            Cell: LinkCellTable,
                            getProps: () => ({
                                handleClick: this.props.handleClickEditInvoice,
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
                    ],
                },
            ];

            return (
                <SortedPaginatedTable
                    columns={columns}
                    data={this.filter(this.props.invoices, this.props.filter)}
                    selectedPageIndex={this.props.selectedPageIndex}
                    handleChangePageIndex={this.props.handleChangePageIndex}
                />
            );
        }
        return <Spinner message="Cargando datos" />;
    }
}

export default InvoicesList;
