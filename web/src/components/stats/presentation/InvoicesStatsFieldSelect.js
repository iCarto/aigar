import React from "react";

class InvoicesStatsFieldSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: [
                {key: "monto", text: "Monto"},
                {key: "consumo", text: "Consumo"},
                {key: "mora", text: "Mora"},
            ],
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(key) {
        this.props.handleChange(key);
    }

    render() {
        return (
            <div className="d-flex justify-content-center">
                <div className="btn-group btn-group-toggle m-3" data-toggle="buttons">
                    {this.state.fields.map(field => (
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
