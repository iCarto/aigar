import {useState} from "react";
import {FormInputText} from ".";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";

const FormCheckboxFieldCombo = ({
    label,
    name,
    value = "",
    predefinedValue = "",
    defaultChecked = false,
    disabled = false,
    errors = [],
    onChange,
    endAdornment = "",
}) => {
    const [isChecked, setIsChecked] = useState(defaultChecked || Boolean(value));
    const [valueForInput, setvalueForInput] = useState(value);

    const handleChange = event => {
        const checked = event.target.checked;
        setIsChecked(checked);

        if (checked) {
            setvalueForInput(predefinedValue);
            onChange(name, predefinedValue);
        } else {
            setvalueForInput("");
            onChange(name, 0);
        }
    };

    return (
        <FormControl
            error={Boolean(errors?.length)}
            margin="none"
            sx={{display: "flex", flexDirection: "row"}}
        >
            <FormInputText
                label={label}
                name={name}
                value={valueForInput}
                onChange={onChange}
                endAdornment={endAdornment}
                readOnly
            />
            <Checkbox
                checked={isChecked}
                onChange={handleChange}
                disabled={disabled}
                sx={{marginX: 1, paddingX: 1.5}}
            />
        </FormControl>
    );
};

export default FormCheckboxFieldCombo;
