import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

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
        <FormControl fullWidth sx={{mt: 2, mb: 1}}>
            <InputLabel shrink htmlFor={name}>
                {label}
            </InputLabel>
            <Select
                multiple
                native
                value={[field.value]}
                onChange={handleChangeEvent}
                label={label}
                inputProps={{
                    id: name,
                    size: 10,
                }}
            >
                <option value=""></option>
                {items?.map((item, index) => (
                    <option key={index} value={item.order}>
                        {item.order} - {item.name}
                    </option>
                ))}
            </Select>
        </FormControl>
    );
};

export default FormSelectOrder;
