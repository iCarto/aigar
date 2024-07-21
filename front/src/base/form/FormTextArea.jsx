import {FormInput} from ".";

const FormTextArea = ({
    label,
    name,
    field,
    value = "",
    onChange,
    readOnly = false,
    required = false,
    placeholder = "",
    maxLength = null,
    rows = 8,
}) => {
    const fieldValue = field ? field.value : value;

    return (
        <FormInput
            name={name}
            label={label}
            placeholder={placeholder}
            value={fieldValue}
            disabled={readOnly}
            required={required}
            onChange={onChange}
            errors={field?.errors}
            maxLength={maxLength}
            rows={rows}
            multiline
        />
    );
};

export default FormTextArea;
