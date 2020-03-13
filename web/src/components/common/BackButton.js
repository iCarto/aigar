import React from "react";

class BackButton extends React.Component {
    render() {
        return (
            <button onClick={this.props.handleBack} className="btn btn-secondary">
                <i className="fas fa-arrow-circle-left mr-2" />
                Volver
            </button>
        );
    }
}

export default BackButton;
