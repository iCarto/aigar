import React from "react";

class Spinner extends React.Component {
    render() {
        return (
            <div className="h-100 text-center d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">{this.props.message}...</span>
                </div>
                <strong className="ml-3">{this.props.message}...</strong>
            </div>
        );
    }
}

export default Spinner;
