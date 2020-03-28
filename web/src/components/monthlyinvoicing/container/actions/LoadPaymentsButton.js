import React from "react";
import {Link} from "react-router-dom";

class LoadPaymentsButton extends React.Component {
    get button() {
        return (
            <Link
                to="/cargarpagos"
                className={
                    "btn btn-secondary mt-2 mb-2 " +
                    (this.props.disabled ? "disabled" : "")
                }
            >
                4. Importar pagos
            </Link>
        );
    }

    render() {
        return !this.props.hidden ? this.button : null;
    }
}

export default LoadPaymentsButton;
