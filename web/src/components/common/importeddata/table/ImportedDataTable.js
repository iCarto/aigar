import React from "react";
import ImportedDataTableRow from "./ImportedDataTableRow";
import ImportedDataTableFilter from "./ImportedDataTableFilter";

class ImportedDataTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            elements: props.elements,
            errors: props.errors,
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    handleFilterChange(filterData) {
        this.setState((prevState, props) => ({
            elements: props.elements.filter(element => {
                let filtered = true;
                if (filterData.filterText != null) {
                    filtered = props.filterByText(element, filterData.filterText);
                }
                if (filterData.showOnlyErrors) {
                    filtered = filtered && element.errors.length !== 0;
                }
                return filtered;
            }),
        }));
    }

    get messages() {
        if (this.state.errors.length !== 0) {
            return (
                <div className="alert alert-danger" role="alert">
                    Se han encontrado errores en&nbsp;
                    <strong>{this.state.errors.length}</strong> registros.
                </div>
            );
        }
        return (
            <div className="alert alert-success" role="alert">
                No se han encontrado errores.
            </div>
        );
    }

    get tableFilter() {
        return <ImportedDataTableFilter handleFilterChange={this.handleFilterChange} />;
    }

    get tableHeaders() {
        return this.props.headers.map((header, index) => {
            return (
                <th scope="col" key={index}>
                    {header}
                </th>
            );
        });
    }

    get tableRows() {
        console.log(this.state.errors);
        return this.state.elements.map(element => {
            let errors = this.state.errors.filter(error => error.id === element.id);
            // Every element must have an "id" attribute with an unique value
            // This is important because filter could fail if elements can repeat their ids
            return (
                <ImportedDataTableRow
                    element={element}
                    errors={errors}
                    key={element.id}
                    fields={this.props.fields}
                />
            );
        });
    }

    render() {
        return (
            <div className="col-12 row">
                <div className="col-12">{this.messages}</div>
                <div className="col-12 mb-2">{this.tableFilter}</div>
                <table className="col-12 table table-bordered text-center">
                    <thead className="thead-dark">
                        <tr>{this.tableHeaders}</tr>
                    </thead>
                    <tbody>{this.tableRows}</tbody>
                </table>
            </div>
        );
    }
}

export default ImportedDataTable;
