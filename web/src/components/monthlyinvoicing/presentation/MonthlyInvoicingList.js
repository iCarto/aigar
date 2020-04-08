import React from "react";
import {SortedPaginatedTable, LinkCellTable} from "components/common/table";
import {
    InvoiceStatusCellTable,
    InvoiceResumenCellTable,
} from "components/invoice/presentation";

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
                    Header: "Nº Factura",
                    accessor: "numero",
                    Cell: LinkCellTable,
                    getProps: () => ({
                        handleClick: this.props.handleClickViewInvoice,
                        linkAccessor: "id_factura",
                    }),
                },
                {
                    Header: "Lectura",
                    accessor: "consumo",
                },
                {
                    Header: "Importe",
                    accessor: "total",
                },
                {
                    Header: "Estado",
                    accessor: "estado",
                    Cell: InvoiceStatusCellTable,
                },
                {
                    Header: "Meses previos",
                    accessor: "resumen",
                    Cell: InvoiceResumenCellTable,
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
