import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const FormSelect = ({
    label,
    name = "",
    field = null,
    value = "",
    defaultValue = {},
    options,
    onChange,
    disabled = false,
    required = false,
    showEmptyOption = false,
    smallInput = false,
}) => {
    const fieldValue = field ? field.value : value;

    const emptyOption = {
        key: "",
        value: "‌‌", // This is not an empty character. It's U+200C unicode character.
    };

    const smallInputStyle = {
        "& .MuiInputBase-input": {
            overflow: "visible",
        },
        "& .MuiSelect-icon": {
            fontSize: "18px",
        },
    };

    return (
        <FormControl fullWidth margin="dense" size="small" required={required}>
            <InputLabel id={`${name}-label`}>{label}</InputLabel>
            <Select
                labelId={`${name}-label`}
                id={`${name}-id`}
                name={name}
                value={fieldValue}
                defaultValue={defaultValue}
                label={label}
                onChange={onChange}
                disabled={disabled}
                sx={smallInput ? smallInputStyle : {}}
            >
                {(showEmptyOption ? [emptyOption, ...options] : options).map(
                    (option, index) => {
                        return (
                            <MenuItem
                                key={index}
                                value={option.key}
                                disabled={!!option.disabled}
                            >
                                {option.value}
                            </MenuItem>
                        );
                    }
                )}
            </Select>
        </FormControl>
    );
};

export default FormSelect;
