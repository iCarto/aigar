import React from "react";

class FormSelectOrder extends React.Component {
    constructor(props) {
        super();
        this.handleChange = this.handleChange.bind(this);
    }

    updateOrders(newOrden) {
        const prevOrden = this.props.field.value;
        let elements = this.props.elements;
        elements = elements.map(item => {
            let orden = item.order;
            if (prevOrden < newOrden) {
                if (orden === prevOrden) {
                    orden = newOrden;
                } else if (orden > prevOrden && orden <= newOrden) {
                    orden = orden - 1;
                }
            } else if (prevOrden > newOrden) {
                if (orden === prevOrden) {
                    orden = newOrden + 1;
                } else if (orden < prevOrden && orden > newOrden) {
                    orden = orden + 1;
                }
            }
            return {
                id: item.id,
                order: orden,
                name: item.name,
            };
        });
        elements.sort((a, b) => {
            return a.order - b.order;
        });
        this.props.handleChange(this.props.name, elements);
    }

    handleChange(event) {
        this.updateOrders(parseInt(event.target.value));
    }

    render() {
        return (
            <div className="form-group">
                <label htmlFor={this.props.name}>{this.props.label}</label>
                <select
                    className="form-control"
                    name={this.props.name}
                    onChange={this.handleChange}
                    value={this.props.field.value}
                    size={10}
                >
                    <option value={0}></option>
                    {this.props.elements.map(element => (
                        <option key={element.order} value={element.order}>
                            {element.order} - {element.name}
                        </option>
                    ))}
                </select>
                <div className="invalid-feedback d-block">
                    {this.props.field.errors}
                </div>
            </div>
        );
    }
}

export default FormSelectOrder;
