import React from "react";

class Spinner extends React.Component {
    render() {
        return (
            <div className="h-100 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">{this.props.message}...</span>
                </div>
            </div>
        );
    }
}

export default Spinner;
