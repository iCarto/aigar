import {FormInput} from ".";

const FormInputDecimal = ({
    label,
    name,
    field = null,
    value = "" || 0,
    onChange,
    readOnly = false,
    required = false,
    placeholder = "",
    endAdornment = null,
    maxLength = null,
}) => {
    const fieldValue = field ? field.value : value;

    const handleInputChange = event => {
        onChange({
            target: {
                name,
                value: event.target.value,
            },
        });
    };

    return (
        <FormInput
            name={name}
            label={label}
            placeholder={placeholder}
            value={fieldValue}
            type="number"
            step="0.01"
            disabled={readOnly}
            required={required}
            onChange={handleInputChange}
            errors={field?.errors}
            maxLength={maxLength}
            endAdornment={endAdornment}
        />
    );
};

export default FormInputDecimal;
