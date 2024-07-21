import {useState} from "react";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const FormCheckbox = ({
    label,
    name,
    value = false,
    defaultChecked = false,
    disabled = false,
    errors = [],
    style = {},
    onChange,
}) => {
    const [isChecked, setIsChecked] = useState(defaultChecked || value);

    const handleChange = event => {
        const userValue = event.target.checked;
        setIsChecked(userValue);
        onChange(name, userValue);
    };

    return (
        <FormControl error={Boolean(errors?.length)} margin="none">
            <FormControlLabel
                label={label}
                name={name}
                control={
                    <Checkbox
                        checked={isChecked}
                        onChange={handleChange}
                        disabled={disabled}
                        sx={style}
                    />
                }
            />
        </FormControl>
    );
};

export default FormCheckbox;
