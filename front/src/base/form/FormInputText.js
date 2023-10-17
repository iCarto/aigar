import {FormInput} from ".";

const FormInputText = ({
    label,
    name,
    field = null,
    value = "",
    onChange,
    readOnly = false,
    required = false,
    placeholder = "",
    endAdornment = null,
    margin = "dense",
    maxLength = null,
}) => {
    const fieldValue = field ? field.value : value;

    return (
        <FormInput
            name={name}
            label={label}
            placeholder={placeholder}
            value={fieldValue || ""}
            disabled={readOnly}
            required={required}
            onChange={onChange}
            errors={field?.errors}
            maxLength={maxLength}
            margin={margin}
            endAdornment={endAdornment}
        />
    );
};

export default FormInputText;
