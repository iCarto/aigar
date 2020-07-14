import React from "react";

class InvoicesFilter extends React.Component {
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

    render() {
        return (
            <form className="column p-3">
                <div className="form-group">
                    <label htmlFor="name">Número</label>
                    <input
                        type="text"
                        className="form-control"
                        name="numero"
                        value={this.props.filter.numero}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="name">Socio</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        value={this.props.filter.nombre}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="sector">Sector</label>
                    <select
                        className="form-control"
                        name="sector"
                        value={this.props.filter.sector}
                        onChange={this.handleChange}
                    >
                        <option></option>
                        {this.props.sectorsDomain.map(sector => (
                            <option key={sector.key} value={sector.key}>
                                {sector.value}
                            </option>
                        ))}
                    </select>
                </div>
            </form>
        );
    }
}

export default InvoicesFilter;
