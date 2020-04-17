import React from "react";
import {DateUtil} from "utilities";

class InvoicesStatsFilter extends React.Component {
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
                    <label htmlFor="startInvoicingMonth">Mes de inicio</label>
                    <select
                        className="form-control"
                        name="startInvoicingMonth"
                        value={this.props.filter.startInvoicingMonth}
                        onChange={this.handleChange}
                    >
                        <option></option>
                        {this.props.invoicingMonths.map(invoicingMonth => (
                            <option
                                key={invoicingMonth.id_mes_facturacion}
                                value={invoicingMonth.id_mes_facturacion}
                            >
                                {DateUtil.getMonthName(invoicingMonth.mes)} -{" "}
                                {invoicingMonth.anho}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="endInvoicingMonth">Mes de fin</label>
                    <select
                        className="form-control"
                        name="endInvoicingMonth"
                        value={this.props.filter.endInvoicingMonth}
                        onChange={this.handleChange}
                    >
                        <option></option>
                        {this.props.invoicingMonths.map(invoicingMonth => (
                            <option
                                key={invoicingMonth.id_mes_facturacion}
                                value={invoicingMonth.id_mes_facturacion}
                            >
                                {DateUtil.getMonthName(invoicingMonth.mes)} -{" "}
                                {invoicingMonth.anho}
                            </option>
                        ))}
                    </select>
                </div>
            </form>
        );
    }
}

export default InvoicesStatsFilter;
