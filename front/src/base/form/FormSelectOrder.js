const FormSelectOrder = ({label, name, field, items, onChange}) => {
    const handleChangeEvent = event => {
        const newOrden = parseInt(event.target.value);

        const prevOrden = field.value;
        let updatedItems = items;
        updatedItems = items.map(item => {
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
        updatedItems.sort((a, b) => {
            return a.order - b.order;
        });

        onChange(updatedItems);
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
                <option value=""></option>
                {items?.map((element, index) => (
                    <option key={index} value={element.order}>
                        {element.order} - {element.name}
                    </option>
                ))}
            </select>
            <div className="invalid-feedback d-block">{field?.errors}</div>
        </div>
    );
};

export default FormSelectOrder;
