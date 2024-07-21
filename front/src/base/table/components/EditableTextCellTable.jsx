// https://codesandbox.io/embed/github/tannerlinsley/react-table/tree/master/examples/editable-data
import {Fragment, useEffect, useState} from "react";
import TextField from "@mui/material/TextField";

const EditableTextCellTable = ({
    cell: {value: initialValue},
    row,
    column: {id},
    onUpdateData, // This is a custom function that we supplied to our table instance
}) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);
    const [readOnly, setReadOnly] = useState(true);

    const onChange = e => {
        setValue(e.target.value);
    };

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        onUpdateData(row, id, value);
        setReadOnly(true);
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const fieldErrors = row.original.errors
        .filter(error => error.field === id)
        .map(error => <Fragment key={error.msg}>{error.msg}</Fragment>);

    const enableInput = () => {
        console.log("enableInput");
        setReadOnly(false);
    };

    return (
        <TextField
            value={value != null ? value : ""}
            disabled={readOnly}
            onChange={onChange}
            onBlur={onBlur}
            onDoubleClick={enableInput}
            error={Boolean(fieldErrors.length)}
            helperText={fieldErrors}
            variant="standard"
            margin="dense"
            size="small"
            sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "#495057",
                },
                "& .MuiInputBase-input": {textAlign: "end"},
            }}
        />
    );
};

export default EditableTextCellTable;
