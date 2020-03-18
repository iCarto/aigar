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
                    data={this.props.invoices}
                    selectedPageIndex={this.props.selectedPageIndex}
                    handleChangePageIndex={this.props.handleChangePageIndex}
                />
            );
        }
        return null;
    }
}

export default MonthlyInvoicingList;
