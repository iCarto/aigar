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
                    Header: "Socio",
                    accessor: d => `${d.num_socio} - ${d.nombre}`,
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
                        className: "cubic-metre",
                    },
                    {
                        Header: "Lectura actual",
                        accessor: "caudal_actual",
                        className: "cubic-metre",
                    },
                    {
                        Header: "Consumo",
                        accessor: "consumo",
                        className: "cubic-metre font-weight-bold",
                    },
                    {
                        Header: "Cuota fija",
                        accessor: "cuota_fija",
                        className: "dollar",
                    },
                    {
                        Header: "Cuota variable",
                        accessor: "cuota_variable",
                        className: "dollar",
                    },
                    {
                        Header: "Saldo pendiente",
                        accessor: "saldo_pendiente",
                        className: "dollar",
                    },
                    {
                        Header: "Total",
                        accessor: "total",
                        className: "dollar font-weight-bold",
                    }
                );
            }
            if (this.props.invoicesTableType === "payments") {
                columns.push(
                    {
                        Header: "Consumo",
                        accessor: "consumo",
                        className: "cubic-metre font-weight-bold",
                    },
                    {
                        Header: "Pago 1 al 11",
                        accessor: "pago_1_al_11",
                        className: "dollar",
                    },
                    {
                        Header: "Pago 11 al 30",
                        accessor: "pago_11_al_30",
                        className: "dollar",
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
                    }
                );
            }
            columns.push({
                Header: "Alertas",
                accessor: "errors",
                className: "text-danger small",
            });

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
