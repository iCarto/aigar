import React from "react";
import {Link} from "react-router-dom";

class LoadMeasurementsButton extends React.Component {
    get button() {
        return (
            <Link
                to={"/cargarlecturas/" + this.props.invoicingMonth.id_mes_facturacion}
                className={
                    "btn btn-primary mt-1 mb-1 " +
                    (this.props.disabled ? "disabled" : "")
                }
            >
                3. Importar lecturas
            </Link>
        );
    }

    render() {
        return !this.props.hidden ? this.button : null;
    }
}

export default LoadMeasurementsButton;
