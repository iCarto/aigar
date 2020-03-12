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
            <form className="column">
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
                        {[1, 2, 3, 4, 5].map(n => (
                            <option key={n}>{n}</option>
                        ))}
                    </select>
                </div>
            </form>
        );
    }
}

export default MembersFilter;
