import React from "react";

class LoadDataInvoicesTableFilter extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const value =
            event.target.type === "checkbox"
                ? event.target.checked
                : event.target.value;
        this.props.handleChange({[name]: value});
    }

    get filterByText() {
        return (
            <div className="form-group">
                <input
                    type="text"
                    name="text"
                    className="form-control"
                    placeholder="Buscar"
                    value={this.props.filter.text}
                    onChange={this.handleChange}
                />
            </div>
        );
    }

    render() {
        return (
            <form className="form-inline d-flex align-self-left mb-2">
                {this.filterByText}
            </form>
        );
    }
}

export default LoadDataInvoicesTableFilter;
