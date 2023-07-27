const InvoicesStatsFieldSelect = ({fields, selectedField, handleChange}) => {
    const handleClick = key => {
        handleChange(key);
    };

    return (
        <div className="d-flex justify-content-center">
            <div className="btn-group btn-group-toggle" data-toggle="buttons">
                {fields.map(field => (
                    <button
                        type="button"
                        key={field.key}
                        className={
                            "btn " +
                            (selectedField === field.key
                                ? "btn-primary"
                                : "btn-secondary")
                        }
                        onClick={e => handleClick(field.key)}
                    >
                        {field.text}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default InvoicesStatsFieldSelect;
