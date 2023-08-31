const FormInputDecimal = ({
    label,
    name,
    field,
    onChange,
    readOnly = false,
    small = false,
    info = "",
}) => {
    const handleChangeEvent = event => {
        onChange(event);
    };

    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <input
                type="number"
                step="0.01"
                className="form-control"
                name={name}
                value={field?.value || ""}
                onChange={handleChangeEvent}
                readOnly={readOnly}
                style={small ? {width: "100px"} : null}
            />
            <small
                id="help"
                className={`form-text text-muted ${info === "" ? "d-none" : ""}`}
            >
                {info}
            </small>
            <div className="invalid-feedback d-block">{field?.errors}</div>
        </div>
    );
};

export default FormInputDecimal;
