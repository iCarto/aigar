import React from "react";

class MonthlyInvoicingFilter extends React.Component {
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
        this.props.handleChange(name, value);
    }

    render() {
        return (
            <form className="column m-3">
                <div className="form-group">
                    <label htmlFor="name">Número</label>
                    <input
                        type="text"
                        className="form-control"
                        name="numero"
                        onChange={this.handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="name">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        onChange={this.handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="sector">Sector</label>
                    <select
                        className="form-control"
                        name="sector"
                        onChange={this.handleChange}
                    >
                        <option></option>
                        {[1, 2, 3, 4, 5].map(n => (
                            <option key={n}>{n}</option>
                        ))}
                    </select>
                </div>
            </form>
        );
    }
}

export default MonthlyInvoicingFilter;
