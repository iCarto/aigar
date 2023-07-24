import React from "react";
import {SortedTable, LinkCellTable} from "base/table";
import {Spinner} from "base/common";
import {InvoiceStatusCellTable} from "invoice/presentational";
import {MemberViewModal} from "member/presentational";

class InvoicesListPreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showMemberModal: null,
            selectedMemberForModal: null,
        };
        this.handleClickViewMember = this.handleClickViewMember.bind(this);
        this.onClickCancelViewMember = this.onClickCancelViewMember.bind(this);
    }

    handleClickViewMember(num_socio) {
        console.log("handleClickViewMember", num_socio);
        this.setState({
            showMemberModal: true,
            selectedMemberForModal: num_socio,
        });
    }

    onClickCancelViewMember() {
        this.setState({
            showMemberModal: null,
            selectedMemberForModal: null,
        });
    }

    get modal() {
        return (
            <MemberViewModal
                num_socio={this.state.selectedMemberForModal}
                showModal={this.state.showMemberModal}
                onClickCancel={this.onClickCancelViewMember}
            />
        );
    }

    render() {
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
                    Header: "Número factura",
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
                        Header: "Total factura",
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
                        Header: "Pago 1 al 15",
                        accessor: "pago_1_al_10",
                        className: "dollar",
                    },
                    {
                        Header: "Pago 16 al 30",
                        accessor: "pago_11_al_30",
                        className: "dollar",
                    },
                    {
                        Header: "Total factura",
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
                <>
                    <div
                        className="overflow-auto border rounded"
                        style={{maxHeight: "450px"}}
                    >
                        <SortedTable columns={columns} data={this.props.invoices} />
                    </div>
                    {this.modal}
                </>
            );
        }
        return <Spinner message="Obteniendo facturas" />;
    }
}

export default InvoicesListPreview;
