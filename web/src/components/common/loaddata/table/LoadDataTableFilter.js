import React from "react";
import _ from "underscore";

class LoadDataTableFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: props.filter.text,
            showOnlyErrors: props.filter.showOnlyErrors,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.handleChangeDebounced = _.debounce(function() {
            console.log(this.state.value);
            this.props.handleChange.apply(this, [
                {text: this.state.text, showOnlyErrors: this.state.showOnlyErrors},
            ]);
        }, 500);
    }

    componentWillUnmount() {
        this.setState = () => {};
        this.handleChangeDebounced.cancel();
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value}, () => {
            this.handleChangeDebounced();
        });
    }

    get selectShowOnlyErrors() {
        return (
            <div className="form-group">
                <label htmlFor="showOnlyErrors">Mostrar</label>
                <select
                    name="showOnlyErrors"
                    className="form-control ml-2"
                    value={this.state.showOnlyErrors}
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
                    value={this.state.text}
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

export default LoadDataTableFilter;
