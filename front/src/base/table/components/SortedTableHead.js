import {visuallyHidden} from "@mui/utils";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";

const SortedTableHead = ({
    columns,
    order,
    orderBy,
    totalSelected = 0,
    rowCount,
    onSelectAllClick = null,
    onRequestSort,
}) => {
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    const checkboxStyle = {
        "&.MuiCheckbox-root": {color: "inherit"},
    };

    return (
        <TableHead>
            <TableRow>
                {onSelectAllClick ? (
                    <TableCell padding="checkbox">
                        <Checkbox
                            color="primary"
                            sx={checkboxStyle}
                            indeterminate={
                                totalSelected > 0 && totalSelected < rowCount
                            }
                            checked={rowCount > 0 && totalSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{
                                "aria-label": "select all",
                            }}
                        />
                    </TableCell>
                ) : null}
                {columns.map((headCell, index) => (
                    <TableCell
                        key={index}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === "desc"
                                        ? "sorted descending"
                                        : "sorted ascending"}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

export default SortedTableHead;
