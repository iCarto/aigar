const FormSelect = ({label, name, value, options, errors = [], onChange}) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <select
                className="form-control"
                name={name}
                onChange={onChange}
                value={value}
            >
                <option></option>
                {options.map(option => (
                    <option key={option.key} value={option.key}>
                        {option.value}
                    </option>
                ))}
            </select>
            <div className="invalid-feedback d-block">{errors}</div>
        </div>
    );
};

export default FormSelect;
