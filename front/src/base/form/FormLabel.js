const FormLabel = ({label, field}) => {
    return (
        <div className="form-group mb-2">
            <label htmlFor="name">{label}</label>
            <strong>{field.value}</strong>
            <div className="invalid-feedback d-block">{field.errors}</div>
        </div>
    );
};

export default FormLabel;
