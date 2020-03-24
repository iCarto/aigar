import React from "react";

class LoadMeasurementsButton extends React.Component {
    get button() {
        return (
            <button
                onClick={this.props.handleClickLoadMeasurements}
                className="btn btn-secondary mt-2 mb-2"
                disabled={this.props.disabled}
            >
                2. Importar lecturas
            </button>
        );
    }

    render() {
        return !this.props.hidden ? this.button : null;
    }
}

export default LoadMeasurementsButton;
