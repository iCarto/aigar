import React from "react";
import _ from "underscore";

class FormInput extends React.Component {
    constructor(props) {
        super();
        this.state = {
            value: props.field.value,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.handleChangeDebounced = _.debounce(function() {
            this.props.handleChange.apply(this, [this.props.name, this.state.value]);
        }, 500);
    }

    componentWillUnmount() {
        this.setState = () => {};
        this.handleChangeDebounced.cancel();
    }

    handleChange(event) {
        this.setState({value: event.target.value}, () => {
            this.handleChangeDebounced();
        });
    }

    render() {
        return (
            <div className="form-group mb-2">
                <label htmlFor="name">{this.props.label}</label>
                <input
                    type="text"
                    className="form-control"
                    name="ahorro"
                    value={
                        this.props.readOnly === true
                            ? this.props.field.value
                            : this.state.value
                    }
                    onChange={this.handleChange}
                    readOnly={this.props.readOnly}
                />
                <div className="invalid-feedback d-block">
                    {this.props.field.errors}
                </div>
            </div>
        );
    }
}

export default FormInput;
