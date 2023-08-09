const FormSelect = ({label, name, value, options, errors = [], onChange}) => {
    return (
        <div className="form-group mb-0">
            <label htmlFor={name}>{label}</label>
            <select
                className="form-control"
                name={name}
                onChange={onChange}
                value={value}
            >
                <option></option>
                {options.map((option, index) => (
                    <option key={index} value={option.key}>
                        {option.value}
                    </option>
                ))}
            </select>
            {errors.length ? (
                <div className="invalid-feedback d-block">{errors}</div>
            ) : null}
        </div>
    );
};

export default FormSelect;
