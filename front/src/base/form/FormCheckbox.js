import {useState} from "react";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const FormCheckbox = ({
    label,
    name,
    value = "",
    onChange,
    disabled = false,
    style = {},
    defaultChecked = false,
    errors = [],
}) => {
    const handleChange = userValue => {
        onChange(userValue);
    };

    return (
        <FormControl error={Boolean(errors?.length)} margin="none">
            <FormControlLabel
                label={label}
                name={name}
                value={value}
                control={
                    <Checkbox
                        checked={defaultChecked || value}
                        onChange={event => {
                            const userValue = event.target.checked;
                            handleChange(userValue);
                        }}
                        disabled={disabled}
                        sx={style}
                    />
                }
            />
        </FormControl>
    );
};

export default FormCheckbox;
