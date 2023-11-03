// https://codesandbox.io/embed/github/tannerlinsley/react-table/tree/master/examples/editable-data

import {useEffect, useState} from "react";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {DateUtil} from "base/format/utilities";
import TextField from "@mui/material/TextField";

const EditableDateCellTable = ({
    cell: {value: initialValue},
    row,
    column: {id},
    onUpdateData, // This is a custom function that we supplied to our table instance
}) => {
    const [formattedDate, setFormattedDate] = useState(
        new Date(DateUtil.parse(initialValue))
    );
    const [readOnly, setReadOnly] = useState(true);

    useEffect(() => {
        setFormattedDate(new Date(DateUtil.parse(initialValue)));
    }, [initialValue]);

    const handleChange = date => {
        setFormattedDate(date);
        onUpdateData(row.index, id, DateUtil.parse(date));
    };

    const handleCloseCalendar = () => {
        setReadOnly(true);
    };

    const fieldErrors = row.original.errors
        .filter(error => error.field === id)
        .map(error => <div key={error.msg}>{error.msg}</div>);

    const enableInput = () => {
        setReadOnly(false);
    };

    return (
        <DatePicker
            value={formattedDate}
            onChange={handleChange}
            onOpen={enableInput}
            onClose={handleCloseCalendar}
            open={!readOnly}
            readOnly={readOnly}
            renderInput={({inputProps, ...params}) => (
                <TextField
                    {...params}
                    inputProps={{
                        ...inputProps,
                        placeholder: "dd/mm/aaaa",
                    }}
                    onDoubleClick={enableInput}
                    size="small"
                    margin="dense"
                    error={Boolean(fieldErrors.length)}
                    helperText={fieldErrors}
                />
            )}
        />
    );
};

export default EditableDateCellTable;
