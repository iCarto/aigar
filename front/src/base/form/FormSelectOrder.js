const FormSelectOrder = ({label, name, field, elements, onChange}) => {
    const updateOrders = newOrden => {
        const prevOrden = field.value;
        let updatedElements = elements.map(item => {
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

        updatedElements.sort((a, b) => {
            return a.order - b.order;
        });

        return updatedElements;
    };

    const handleChangeEvent = event => {
        const updatedList = updateOrders(parseInt(event.target.value));
        onChange(name, updatedList);
    };

    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <select
                className="form-control"
                name={name}
                onChange={handleChangeEvent}
                value={field.value}
                size={10}
            >
                <option value={0}></option>
                {elements.map(element => (
                    <option key={element.order} value={element.order}>
                        {element.order} - {element.name}
                    </option>
                ))}
            </select>
            <div className="invalid-feedback d-block">{field.errors}</div>
        </div>
    );
};

export default FormSelectOrder;
