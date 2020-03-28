import React from "react";
import {Link} from "react-router-dom";
import {InvoiceService} from "service/api";
import {createInvoice} from "model";
import {Spinner} from "components/common";
import {SortedTable} from "components/common/table";

class LoadMeasurementsStep3Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            updatedInvoices: null,
        };
    }

    componentDidMount() {
        InvoiceService.getInvoicesByYearAndMonth(
            this.props.invoicingMonth.year,
            this.props.invoicingMonth.month
        ).then(invoices => {
            const invoicesToUpdate = this.props.measurements.map(measurement => {
                const invoice = invoices.find(
                    invoice => measurement.num_socio === invoice.num_socio
                );
                console.log(invoice.num_socio, measurement, {measurement});
                return createInvoice(
                    Object.assign({}, invoice, {
                        caudal_anterior: measurement.lectura_anterior,
                        caudal_actual: measurement.lectura,
                    })
                );
            });
            console.log({invoicesToUpdate});
            InvoiceService.updateInvoicingMonth(invoicesToUpdate).then(
                updatedInvoices => {
                    this.setState({loading: false, updatedInvoices});
                }
            );
        });
    }

    /* VIEW SUBCOMPONENTS */

    get messages() {
        return (
            <div className="alert alert-success text-center" role="alert">
                Los datos se han importado correctamente.
            </div>
        );
    }

    get inicioButton() {
        return (
            <Link to="/">
                <button className="btn btn-primary center" type="button">
                    Volver al listado de facturas <i className="fas fa-list"></i>
                </button>
            </Link>
        );
    }

    render() {
        const columns = [
            {
                Header: "Sector",
                accessor: "sector",
            },
            {
                Header: "Nº socio",
                accessor: "num_socio",
            },
            {
                Header: "Nombre",
                accessor: "nombre",
            },
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
                Header: "Total",
                accessor: "total",
            },
        ];
        return (
            <div className="d-flex flex-column justify-content-around align-items-center">
                {!this.state.loading ? (
                    <>
                        {this.messages}
                        {this.inicioButton}
                        <div
                            className="overflow-auto border rounded"
                            style={{maxHeight: "550px"}}
                        >
                            <SortedTable
                                columns={columns}
                                data={this.state.updatedInvoices}
                            />
                        </div>
                    </>
                ) : (
                    <Spinner message="Actualizando facturas" />
                )}
            </div>
        );
    }
}

export default LoadMeasurementsStep3Results;
