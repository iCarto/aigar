import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

const FormInput = ({
    label,
    name,
    value = "",
    onChange = null,
    type = "text",
    step = "",
    disabled = false,
    required = false,
    placeholder = "",
    endAdornment = null,
    margin = "dense",
    maxLength = null,
    multiline = false,
    rows = null,
    errors = [],
}) => {
    const handleChangeEvent = event => {
        if (onChange) onChange(event);
    };

    let inputProps = {};
    if (endAdornment) {
        inputProps = {
            ...inputProps,
            endAdornment: (
                <InputAdornment position="start">{endAdornment}</InputAdornment>
            ),
        };
    }

    const isValue = value !== null && value !== undefined && value !== ""; // 0 should not be considered as falsy

    return (
        <TextField
            id={name}
            type={type}
            name={name}
            label={label}
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            required={required}
            onChange={handleChangeEvent}
            error={Boolean(errors?.length)}
            helperText={errors}
            variant="outlined"
            margin={margin}
            size="small"
            multiline={multiline}
            rows={rows}
            fullWidth
            InputProps={inputProps}
            inputProps={{maxLength: maxLength, step: step}}
            InputLabelProps={{shrink: isValue}}
        />
    );
};

export default FormInput;
