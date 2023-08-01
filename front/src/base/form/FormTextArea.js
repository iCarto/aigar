const FormTextArea = ({label, name, value, errors = [], onChange}) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <textarea
                className="form-control"
                name="observaciones"
                value={value}
                onChange={onChange}
            />
            <div className="invalid-feedback d-block">{errors}</div>
        </div>
    );
};

export default FormTextArea;
