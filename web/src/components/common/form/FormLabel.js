import React from "react";
import _ from "underscore";

class FormLabel extends React.Component {
    render() {
        return (
            <div className="form-group mb-2">
                <label htmlFor="name">{this.props.label}</label>
                <strong>{this.props.field.value}</strong>
                <div className="invalid-feedback d-block">
                    {this.props.field.errors}
                </div>
            </div>
        );
    }
}

export default FormLabel;
