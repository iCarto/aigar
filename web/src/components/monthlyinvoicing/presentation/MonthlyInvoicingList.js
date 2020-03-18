import React from "react";
import {SortedPaginatedTable, LinkCellTable} from "components/common/table";

const EstadoCellTable = ({cell}) => {
    if (cell.value === "nueva") {
        return "Nueva";
    }
    if (cell.value === "emitida") {
        return "Emitida";
    }
    if (cell.value === "pendiente_cobro") {
        return "Pendiente de cobro";
    }
    if (cell.value === "cobrada") {
        return "Cobrada";
    }
    if (cell.value === "anulada") {
        return "Anulada";
    }
    return cell.value;
};

const TipoSocioCellTable = ({cell}) => {
    if (cell.value === "normal") {
        return "Normal";
    }
    if (cell.value === "con_mecha") {
        return "Con Mecha";
    }
    if (cell.value === "con_ajuste_consumo") {
        return "Con ajuste";
    }
    return cell.value;
};

class MonthlyInvoicingList extends React.Component {
    filter(invoices, filter) {
        return invoices.filter(invoice => {
            var filtered = true;
            if (filter) {
                if (filter.nombre) {
                    filtered = filtered && invoice.nombre.indexOf(filter.nombre) >= 0;
                }
                if (filter.sector) {
                    filtered = filtered && invoice.sector === parseInt(filter.sector);
                }
                if (filter.tipo_socio) {
                    filtered = filtered && invoice.tipo_socio === filter.tipo_socio;
                }
                if (filter.estado) {
                    filtered = filtered && invoice.estado === filter.estado;
                }
            }
            return filtered;
        });
    }
    render() {
        if (this.props.invoices) {
            const columns = [
                {
                    Header: "Listado de facturación",
                    columns: [
                        {
                            Header: "Usuario",
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
                        },
                        {
                            Header: "Tipo",
                            accessor: "tipo_socio",
                            Cell: TipoSocioCellTable,
                        },
                        {
                            Header: "Lectura",
                            accessor: "consumo",
                            Cell: LinkCellTable,
                            getProps: () => ({
                                handleClick: this.props.handleClickEditInvoice,
                                linkAccessor: "id_factura",
                            }),
                        },
                        {
                            Header: "Importe",
                            accessor: "total",
                            Cell: LinkCellTable,
                            getProps: () => ({
                                handleClick: this.props.handleClickEditInvoice,
                                linkAccessor: "id_factura",
                            }),
                        },
                        {
                            Header: "Estado",
                            accessor: "estado",
                            Cell: EstadoCellTable,
                        },
                        /*{
                            Header: "Mora",
                            accessor: "mora",
                        },*/
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
        return null;
    }
}

export default MonthlyInvoicingList;
