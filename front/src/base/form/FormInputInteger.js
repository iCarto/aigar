import {FormInput} from ".";

const FormInputInteger = ({
    label,
    name = "",
    field = null,
    value = null,
    onChange = null,
    readOnly = false,
    required = false,
    placeholder = "",
    margin = "dense",
    endAdornment = null,
    maxLength = null,
}) => {
    const fieldValue = field ? field.value : value;

    const handleInputChange = event => {
        const numericValue = event.target.value.replace(/[^0-9]/g, "");

        onChange({
            target: {
                name,
                value: numericValue,
            },
        });
    };

    return (
        <FormInput
            name={name}
            label={label}
            placeholder={placeholder}
            value={fieldValue || ""}
            disabled={readOnly}
            required={required}
            onChange={handleInputChange}
            errors={field?.errors}
            maxLength={maxLength}
            margin={margin}
            endAdornment={endAdornment}
        />
    );
};

export default FormInputInteger;
