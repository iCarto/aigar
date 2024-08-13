import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";

export const RemoveRowCellTable = ({row, column, cell}) => {
    const props = column.getProps();
    const item = row.original;

    if (item?.errors && item?.errors.length > 0) {
        return (
            <Button
                onClick={() => props.handleClick(item)}
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon fontSize="small" />}
                fullWidth
            >
                Eliminar
            </Button>
        );
    }

    return null;
};
