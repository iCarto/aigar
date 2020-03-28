import React from "react";
import {Util} from "components/util";

class ImportedDataTableFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showOnlyErrors: false,
            filterText: null,
        };

        // https://lifesaver.codes/answer/debounce-and-onchange
        this.liftUpFilterChange = Util.debounce(this.liftUpFilterChange, 250);
    }

    handleShowErrorsChange(event) {
        this.setState(
            {
                showOnlyErrors: event.target.value === "errors",
            },
            // lift up state when is updated
            () => {
                this.liftUpFilterChange();
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
                this.liftUpFilterChange();
            }
        );
    }

    liftUpFilterChange() {
        this.props.handleFilterChange(this.state);
    }

    get selectShowOnlyErrors() {
        return (
            <div className="form-group">
                <label htmlFor="selectShowOnlyErrors">Mostrar</label>
                <select
                    name="selectShowOnlyErrors"
                    className="form-control ml-2"
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
            <div className="form-group">
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
            <form className="form-inline d-flex justify-content-between mb-2">
                {this.filterByText}
                {this.selectShowOnlyErrors}
            </form>
        );
    }
}

export default ImportedDataTableFilter;
