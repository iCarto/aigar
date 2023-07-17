import React from "react";

class ErrorMessage extends React.Component {
    render() {
        if (this.props.message) {
            return <div className="alert alert-danger">{this.props.message}</div>;
        }
        return null;
    }
}

export default ErrorMessage;
