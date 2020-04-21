import React from "react";
import {SortedTable, LinkCellTable} from "components/common/table";
import {Spinner} from "components/common";
import {InvoiceStatusCellTable} from "components/invoice/presentation";

class InvoicesListPreview extends React.Component {
    constructor(props) {
        super(props);
        this.handleClickViewMember = this.handleClickViewMember.bind(this);
    }

    handleClickViewMember(num_socio) {
        window.open("/socios/" + num_socio, "_blank");
    }

    render() {
        console.log("InvoicesListPreview.render");

        if (this.props.invoices) {
            const columns = [
                {
                    Header: "Número",
                    accessor: "num_socio",
                    Cell: LinkCellTable,
                    getProps: () => ({
                        handleClick: this.handleClickViewMember,
                        linkAccessor: "num_socio",
                    }),
                },
                {
                    Header: "Nombre",
                    accessor: "nombre",
                    Cell: LinkCellTable,
                    getProps: () => ({
                        handleClick: this.handleClickViewMember,
                        linkAccessor: "num_socio",
                    }),
                },
                {
                    Header: "Sector",
                    accessor: "sector",
                },
                {
                    Header: "Número Factura",
                    accessor: "numero",
                },
            ];
            if (this.props.invoicesTableType === "measurements") {
                columns.push(
                    {
                        Header: "Lectura anterior",
                        accessor: "caudal_anterior",
                    },
                    {
                        Header: "Lectura actual",
                        accessor: "caudal_actual",
                    },
                    {
                        Header: "Consumo",
                        accessor: "consumo",
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
                        Header: "Saldo pendiente",
                        accessor: "saldo_pendiente",
                    },
                    {
                        Header: "Total",
                        accessor: "total",
                    }
                );
            }
            if (this.props.invoicesTableType === "payments") {
                columns.push(
                    {
                        Header: "Consumo",
                        accessor: "consumo",
                    },
                    {
                        Header: "Pago 1 al 11",
                        accessor: "pago_1_al_11",
                    },
                    {
                        Header: "Pago 11 al 30",
                        accessor: "pago_11_al_30",
                    },
                    {
                        Header: "Total",
                        accessor: "total",
                    },
                    {
                        Header: "Estado",
                        accessor: "estado",
                        Cell: InvoiceStatusCellTable,
                    }
                );
            }

            return (
                <div
                    className="overflow-auto border rounded"
                    style={{maxHeight: "450px"}}
                >
                    <SortedTable columns={columns} data={this.props.invoices} />
                </div>
            );
        }
        return <Spinner message="Obteniendo facturas" />;
    }
}

export default InvoicesListPreview;
