import React from "react";

class ImportedDataTableFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showOnlyErrors: false,
            filterText: null,
        };
    }

    handleShowErrorsChange(event) {
        this.setState(
            {
                showOnlyErrors: event.target.value === "errors",
            },
            // lift up state when is updated
            () => {
                this.props.handleFilterChange(this.state);
            }
        );
    }

    handleFilterByTextChange(event) {
        this.setState(
            {
                filterText: event.target.value,
            },
            // lift up state when is updated
            () => {
                this.props.handleFilterChange(this.state);
            }
        );
    }

    get selectShowOnlyErrors() {
        return (
            <div className="form-group">
                <label htmlFor="selectShowOnlyErrors" className="mr-sm-2">
                    Mostrar
                </label>
                <select
                    name="selectShowOnlyErrors"
                    className="form-control"
                    value={this.state.showErrors}
                    onChange={event => this.handleShowErrorsChange(event)}
                >
                    <option value="all">Todos</option>
                    <option value="errors">Errores</option>
                </select>
            </div>
        );
    }

    get filterByText() {
        return (
            <div className="form-group ml-sm-2">
                <input
                    type="text"
                    name="filterByText"
                    className="form-control"
                    placeholder="Buscar"
                    onChange={event => this.handleFilterByTextChange(event)}
                />
            </div>
        );
    }

    render() {
        return (
            <form className="form-inline float-sm-right">
                {this.selectShowOnlyErrors}
                {this.filterByText}
            </form>
        );
    }
}

export default ImportedDataTableFilter;
