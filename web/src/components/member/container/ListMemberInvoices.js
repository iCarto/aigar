import React from "react";
import {InvoiceService} from "service/api";
import {SortedPaginatedTable} from "components/common/table";
import {Spinner} from "components/common";

class ListMemberInvoices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoices: null,
            num_socio: null,
        };
    }

    static getDerivedStateFromProps(props, prevState) {
        const num_socio = props.num_socio;
        if (num_socio !== prevState.num_socio) {
            return {
                invoices: null,
                num_socio,
            };
        }
        return null;
    }

    componentDidMount() {
        this.loadInvoicesForMember();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.invoices === null) {
            this.loadInvoicesForMember();
        }
    }

    loadInvoicesForMember() {
        InvoiceService.getInvoicesForMember(this.props.num_socio).then(invoices => {
            console.log("invoices", invoices);
            this.setState({invoices});
        });
    }

    render() {
        console.log("ListMemberInvoices.render");
        if (this.state.invoices) {
            const columns = [
                {
                    Header: "Listado de facturas",
                    columns: [
                        {
                            Header: "Número",
                            accessor: "numero",
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
                <SortedPaginatedTable columns={columns} data={this.state.invoices} />
            );
        }
        return <Spinner message="Cargando datos" />;
    }
}

export default ListMemberInvoices;
