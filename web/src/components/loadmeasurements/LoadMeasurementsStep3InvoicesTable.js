import React from "react";
import {Link} from "react-router-dom";
import {InvoicingMonthService} from "service/api";
import {createInvoice, createInvoicingMonth} from "model";
import {Spinner} from "components/common";
import {SortedTable} from "components/common/table";

class LoadMeasurementsStep3InvoicesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: null,
            invoicingMonthToUpdate: props.invoicingMonth,
        };
        this.updateInvoices = this.updateInvoices.bind(this);
    }

    componentDidMount() {
        this.props.setIsPreviousButtonEnabled(true);
        this.setState({status: "loading"});

        const invoicesToUpdate = this.props.measurements.map(measurement => {
            const invoice = this.props.invoicingMonth.invoices.find(
                invoice => measurement.num_socio === invoice.num_socio
            );
            return createInvoice(
                Object.assign({}, invoice, {
                    caudal_anterior: measurement.lectura_anterior,
                    caudal_actual: measurement.lectura,
                })
            );
        });
        const invoicingMonthToPreview = createInvoicingMonth(
            Object.assign({}, this.props.invoicingMonth, {
                invoices: invoicesToUpdate,
            })
        );
        InvoicingMonthService.previewInvoicingMonth(invoicingMonthToPreview).then(
            invoicingMonth => {
                this.setState({
                    status: "review",
                    invoicingMonthToUpdate: invoicingMonth,
                });
            }
        );
    }

    updateInvoices() {
        this.setState({status: "saving"});
        InvoicingMonthService.updateInvoicingMonth(this.state.invoicingMonthToUpdate)
            .then(updatedInvoicingMonth => {
                this.setState({
                    status: "ok",
                    invoicingMonthToUpdate: updatedInvoicingMonth,
                });
            })
            .catch(error => {
                this.setState({
                    status: "error",
                    invoicingMonthToUpdate: null,
                });
            });
    }

    /* VIEW SUBCOMPONENTS */

    get messageOk() {
        return (
            <div className="alert alert-success text-center" role="alert">
                Las facturas se han actualizado correctamente.
            </div>
        );
    }

    get messageError() {
        return (
            <div className="alert alert-danger text-center" role="alert">
                Se ha producido un error durante la actualización de las facturas y no
                se han podido guardar los datos.
            </div>
        );
    }

    get updateButton() {
        return (
            <button
                className="btn btn-primary center"
                onClick={this.updateInvoices}
                type="button"
            >
                Actualizar facturas <i className="fas fa-save"></i>
            </button>
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

    get table() {
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
            <SortedTable
                columns={columns}
                data={this.state.invoicingMonthToUpdate.invoices}
            />
        );
    }

    get content() {
        if (this.state.status === "loading") {
            return <Spinner message="Obteniendo facturas" />;
        }
        if (this.state.status === "saving") {
            return <Spinner message="Actualizando facturas" />;
        }
        if (this.state.status === "ok") {
            return (
                <>
                    {this.messageOk}
                    {this.inicioButton}
                </>
            );
        }
        if (this.state.status === "error") {
            return <>{this.messageError}</>;
        }
        if (this.state.invoicingMonthToUpdate) {
            return (
                <>
                    <div
                        className="overflow-auto border rounded"
                        style={{maxHeight: "550px"}}
                    >
                        {this.table}
                    </div>
                    <div className="mt-3">{this.updateButton}</div>
                </>
            );
        }
        return null;
    }

    render() {
        return (
            <div className="d-flex flex-column justify-content-around align-items-center">
                {this.content}
            </div>
        );
    }
}

export default LoadMeasurementsStep3InvoicesTable;
