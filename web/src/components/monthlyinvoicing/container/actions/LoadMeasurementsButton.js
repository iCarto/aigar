import React from "react";
import {Link} from "react-router-dom";

class LoadMeasurementsButton extends React.Component {
    get button() {
        return (
            <Link
                to="/cargarlecturas"
                className={
                    "btn btn-secondary mt-2 mb-2 " +
                    (this.props.disabled ? "disabled" : "")
                }
            >
                2. Importar lecturas
            </Link>
        );
    }

    render() {
        return !this.props.hidden ? this.button : null;
    }
}

export default LoadMeasurementsButton;
