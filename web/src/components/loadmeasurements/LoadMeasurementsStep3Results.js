import React from "react";
import {Link} from "react-router-dom";

class LoadMeasurementsStep3Results extends React.Component {
    /* VIEW SUBCOMPONENTS */

    get inicioButton() {
        return (
            <Link to="/">
                <button className="btn btn-primary center" type="button">
                    Página de inicio <i className="fas fa-home"></i>
                </button>
            </Link>
        );
    }

    render() {
        return (
            <div className="row col-12">
                <div className="col-12 alert alert-success" role="alert">
                    Los datos se han importado correctamente.
                </div>
                <div className="col-12 text-center">{this.inicioButton}</div>
            </div>
        );
    }
}

export default LoadMeasurementsStep3Results;
