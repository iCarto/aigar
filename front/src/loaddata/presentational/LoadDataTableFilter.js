import {useState, useEffect} from "react";
import _ from "underscore";
import {FormInputText, FormSelect} from "base/form";
import Grid from "@mui/material/Grid";

const LoadDataTableFilter = ({filter, onChange}) => {
    const [textSearch, setTextSearch] = useState(filter.textSearch);
    const [showOnlyErrors, setShowOnlyErrors] = useState(filter.showOnlyErrors);

    useEffect(() => {
        const handleChangeDebounced = _.debounce(function () {
            onChange({
                textSearch: textSearch,
                showOnlyErrors: showOnlyErrors,
            });
        }, 500);

        return () => {
            handleChangeDebounced.cancel();
        };
    }, [textSearch, showOnlyErrors]);

    const fields = {
        textSearch: filter?.textSearch || "",
        showOnlyErrors: filter?.showOnlyErrors,
    };

    const handleTextChange = event => {
        setTextSearch(event.target.value);
        onChange({textSearch: event.target.value});
    };

    const handleShowOnlyErrorsChange = event => {
        const value = JSON.parse(event.target.value);
        setShowOnlyErrors(value);
        onChange({showOnlyErrors: value});
    };

    return (
        <Grid container flexDirection="row" justifyContent="space-between">
            <Grid item xs={3}>
                <FormInputText
                    label="Buscar"
                    name="textSearch"
                    value={fields.textSearch}
                    onChange={handleTextChange}
                />
            </Grid>
            <Grid item xs={3}>
                <FormSelect
                    label="Mostrar"
                    name="showOnlyErrors"
                    value={fields.showOnlyErrors}
                    options={[
                        {key: false, value: "Todos"},
                        {key: true, value: "Errores"},
                    ]}
                    onChange={handleShowOnlyErrorsChange}
                />
            </Grid>
        </Grid>
    );
};

export default LoadDataTableFilter;
