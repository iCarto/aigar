import React from "react";

class BackToMonthInfo extends React.Component {
    render() {
        return (
            <button onClick={this.props.handleBack} className="btn btn-secondary">
                <i className="fas fa-arrow-circle-left mr-2" />
                Volver al listado
            </button>
        );
    }
}

export default BackToMonthInfo;
