import React from "react";

class ErrorMessage extends React.Component {
    render() {
        return <div className="alert alert-danger">{this.props.message}</div>;
    }
}

export default ErrorMessage;
