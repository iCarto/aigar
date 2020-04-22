import React from "react";

class MembersFilter extends React.Component {
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
            <form className="column m-3">
                <div className="form-group">
                    <label htmlFor="num_socio">Número de socio</label>
                    <input
                        type="text"
                        className="form-control"
                        name="num_socio"
                        value={this.props.filter.num_socio}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="name">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={this.props.filter.name}
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
            </form>
        );
    }
}

export default MembersFilter;
