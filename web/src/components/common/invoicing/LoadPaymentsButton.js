import React from "react";

class LoadPaymentsButton extends React.Component {
    get button() {
        return (
            <button
                onClick={this.props.handleClickLoadMeasurements}
                className="btn btn-secondary mt-2 mb-2"
                disabled={this.props.disabled}
            >
                4. Importar pagos
            </button>
        );
    }

    render() {
        return !this.props.hidden ? this.button : null;
    }
}

export default LoadPaymentsButton;
