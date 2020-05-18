import React from "react";
import {Link} from "react-router-dom";

class LoadPaymentsButton extends React.Component {
    get button() {
        return (
            <Link
                to={"/cargarpagos/" + this.props.invoicingMonth.id_mes_facturacion}
                className={
                    "btn mt-1 mb-1 " +
                    (this.props.disabled ? "btn-secondary disabled" : "btn-primary")
                }
            >
                {this.props.position ? this.props.position + ". " : null}
                Importar pagos
            </Link>
        );
    }

    render() {
        return !this.props.hidden ? this.button : null;
    }
}

export default LoadPaymentsButton;
