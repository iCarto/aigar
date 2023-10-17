// https://codesandbox.io/embed/github/tannerlinsley/react-table/tree/master/examples/editable-data
import {useEffect, useState} from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const EditableSelectCellTable = ({
    cell: {value: initialValue},
    row,
    column: {id},
    onUpdateData, // This is a custom function that we supplied to our table instance
}) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);
    const [readOnly, setReadOnly] = useState(true);

    const onChange = e => {
        console.log(e.target.value);
        setValue(e.target.value === true);
    };

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        onUpdateData(row.index, id, value);
        setReadOnly(true);
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const enableInput = () => {
        console.log("enableInput");
        setReadOnly(false);
    };

    const smallInputStyle = {
        "& .MuiInputBase-input": {
            overflow: "visible",
        },
        "& .MuiSelect-icon": {
            fontSize: "18px",
        },
    };

    const options = [
        {key: false, value: "No"},
        {key: true, value: "Sí"},
    ];

    return (
        <Select
            value={value}
            name="editableSelectCell"
            onChange={!readOnly ? onChange : null}
            onDoubleClick={enableInput}
            onBlur={!readOnly ? onBlur : null}
            disabled={readOnly}
            size="small"
            sx={smallInputStyle}
            fullWidth
        >
            {options.map((option, index) => {
                return (
                    <MenuItem key={index} value={option.key}>
                        {option.value}
                    </MenuItem>
                );
            })}
        </Select>
    );
};

export default EditableSelectCellTable;
