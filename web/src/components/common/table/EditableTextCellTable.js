// https://codesandbox.io/embed/github/tannerlinsley/react-table/tree/master/examples/editable-data
import React from "react";

const EditableTextCellTable = ({
    cell: {value: initialValue},
    row,
    column: {id},
    onUpdateData, // This is a custom function that we supplied to our table instance
}) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);
    const [readOnly, setReadOnly] = React.useState(true);

    const onChange = e => {
        setValue(e.target.value);
    };

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        onUpdateData(row.index, id, value);
        setReadOnly(true);
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const errorStyle = {color: "red"};

    const fieldErrors = row.original.errors
        .filter(error => error.field === id)
        .map(error => <div key={error.msg}>{error.msg}</div>);

    const enableInput = () => {
        console.log("enableInput");
        setReadOnly(false);
    };

    return (
        <div>
            <input
                value={value != null ? value : ""}
                onChange={onChange}
                onBlur={onBlur}
                onDoubleClick={enableInput}
                style={fieldErrors.length !== 0 ? errorStyle : null}
                className="form-control"
                readOnly={readOnly}
            />
            <small className="text-danger">{fieldErrors}</small>
        </div>
    );
};

export default EditableTextCellTable;
