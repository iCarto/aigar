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
            <form className="column p-3">
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
                <div className="form-group">
                    <label htmlFor="tipo_socio">Tipo de socio</label>
                    <select
                        className="form-control"
                        name="tipo_socio"
                        value={this.props.filter.tipo_socio}
                        onChange={this.handleChange}
                    >
                        <option></option>
                        {this.props.memberTypesDomain.map(memberType => (
                            <option key={memberType.key} value={memberType.key}>
                                {memberType.value}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="estado">Estado</label>
                    <select
                        className="form-control"
                        name="estado"
                        value={this.props.filter.estado}
                        onChange={this.handleChange}
                    >
                        <option></option>
                        {this.props.invoiceStatusDomain.map(invoiceStatus => (
                            <option key={invoiceStatus.key} value={invoiceStatus.key}>
                                {invoiceStatus.value}
                            </option>
                        ))}
                    </select>
                </div>
            </form>
        );
    }
}

export default MonthlyInvoicingFilter;
