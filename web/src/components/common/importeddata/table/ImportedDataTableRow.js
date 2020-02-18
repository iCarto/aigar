import React from "react";

class ImportedDataTableRow extends React.Component {
    getRowClassName() {
        return this.props.errors.length > 0 ? "table-danger" : null;
    }

    getCellErrors(field) {
        return this.props.errors.filter(error => error.field === field);
    }

    getCellValue(field) {
        let cellErrors = this.getCellErrors(field);
        return cellErrors.length > 0 ? (
            <strong>
                <u className="text-danger">{this.props.element[field]}</u>
            </strong>
        ) : (
            this.props.element[field]
        );
    }

    getCellError(field) {
        return this.getCellErrors(field)
            .map(error => error.msg)
            .join("\n");
    }

    render() {
        return (
            <tr className={this.getRowClassName()}>
                {this.props.fields.map((field, index) => {
                    return (
                        <td title={this.getCellError(field)} key={index}>
                            {this.getCellValue(field)}
                        </td>
                    );
                })}
            </tr>
        );
    }
}

export default ImportedDataTableRow;
