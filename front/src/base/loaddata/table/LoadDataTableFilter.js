import {useState, useEffect} from "react";
import _ from "underscore";

const LoadDataTableFilter = ({filter, handleChange}) => {
    const [text, setText] = useState(filter.text);
    const [showOnlyErrors, setShowOnlyErrors] = useState(filter.showOnlyErrors);

    useEffect(() => {
        const handleChangeDebounced = _.debounce(function () {
            handleChange({
                text: text,
                showOnlyErrors: showOnlyErrors,
            });
        }, 500);

        return () => {
            handleChangeDebounced.cancel();
        };
    }, [text, showOnlyErrors, handleChange]);

    const handleTextChange = event => {
        setText(event.target.value);
    };

    const handleShowOnlyErrorsChange = event => {
        setShowOnlyErrors(event.target.value);
    };

    const selectShowOnlyErrors = (
        <div className="form-group">
            <label htmlFor="showOnlyErrors">Mostrar</label>
            <select
                name="showOnlyErrors"
                className="form-control ml-2"
                value={showOnlyErrors}
                onChange={handleShowOnlyErrorsChange}
            >
                <option value={false}>Todos</option>
                <option value={true}>Errores</option>
            </select>
        </div>
    );

    const filterByText = (
        <div className="form-group">
            <input
                type="text"
                name="text"
                className="form-control"
                placeholder="Buscar"
                value={text}
                onChange={handleTextChange}
            />
        </div>
    );

    return (
        <form className="form-inline d-flex justify-content-between mb-2">
            {filterByText}
            {selectShowOnlyErrors}
        </form>
    );
};

export default LoadDataTableFilter;
