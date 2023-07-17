import React from "react";
import {Link} from "react-router-dom";
import {InvoicingMonthService} from "service/api";
import {Spinner} from "components/common";

class LoadMeasurementsStep4Result extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: null,
        };
    }

    componentDidMount() {
        InvoicingMonthService.saveMeasurements(
            this.props.id_mes_facturacion,
            this.props.measurements
        )
            .then(invoicesUpdated => {
                this.setState({
                    result: true,
                });
            })
            .catch(error => {
                this.setState({
                    result: false,
                });
            });
    }

    /* VIEW SUBCOMPONENTS */
    get messageError() {
        return (
            <div className="alert alert-danger text-center" role="alert">
                Se ha producido un error durante la actualización de las facturas y no
                se han podido guardar los datos.
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

    get messageOk() {
        return (
            <>
                <div className="alert alert-success text-center" role="alert">
                    Las facturas se han actualizado correctamente.
                </div>
                {this.inicioButton}
            </>
        );
    }

    render() {
        if (this.state.result != null) {
            return (
                <div className="d-flex flex-column justify-content-around align-items-center">
                    {this.state.result === true ? this.messageOk : this.messageError}
                </div>
            );
        }
        return <Spinner message="Actualizando facturas" />;
    }
}

export default LoadMeasurementsStep4Result;
