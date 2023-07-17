import React from "react";

class InvoicesStatsFieldSelect extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(key) {
        this.props.handleChange(key);
    }

    render() {
        return (
            <div className="d-flex justify-content-center">
                <div className="btn-group btn-group-toggle mb-3" data-toggle="buttons">
                    {this.props.fields.map(field => (
                        <button
                            type="button"
                            key={field.key}
                            className={
                                "btn " +
                                (this.props.selectedField === field.key
                                    ? "btn-primary"
                                    : "btn-secondary")
                            }
                            onClick={e => this.handleChange(field.key)}
                        >
                            {field.text}
                        </button>
                    ))}
                </div>
            </div>
        );
    }
}

export default InvoicesStatsFieldSelect;
