import React from "react";
import {Util} from "components/util";

class LoadDataMeasurementsTableFilter extends React.Component {
    constructor(props) {
        super(props);

        // https://lifesaver.codes/answer/debounce-and-onchange
        // this.handleChange = Util.debounce(this.handleChange.bind(this), 250);
        this.handleChange = this.handleChange.bind(this);
        this.liftUpHandleChange = Util.debounce(
            this.liftUpHandleChange.bind(this),
            250
        );
    }

    handleChange(event) {
        const name = event.target.name;
        const value =
            event.target.type === "checkbox"
                ? event.target.checked
                : event.target.value;
        this.props.handleChange({[name]: value});
        // this.liftUpHandleChange({[name]: value});
    }

    liftUpHandleChange(newFilter) {
        this.props.handleChange(newFilter);
    }

    get selectShowOnlyErrors() {
        return (
            <div className="form-group">
                <label htmlFor="showOnlyErrors">Mostrar</label>
                <select
                    name="showOnlyErrors"
                    className="form-control ml-2"
                    value={this.props.filter.showOnlyErrors}
                    onChange={this.handleChange}
                >
                    <option value={false}>Todos</option>
                    <option value={true}>Errores</option>
                </select>
            </div>
        );
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
            <form className="form-inline d-flex justify-content-between mb-2">
                {this.filterByText}
                {this.selectShowOnlyErrors}
            </form>
        );
    }
}

export default LoadDataMeasurementsTableFilter;
