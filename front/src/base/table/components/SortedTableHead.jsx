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
        <>
            <colgroup>
                {onSelectAllClick ? <col key="checkboxColumn" width="auto" /> : null}
                {columns.map((column, index) => {
                    return <col key={index} width={column.width + "%"} />;
                })}
            </colgroup>
            <TableHead>
                <TableRow>
                    {onSelectAllClick ? (
                        <TableCell padding="checkbox" key="checkboxColumn">
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
                    {columns.map((column, index) => (
                        <TableCell
                            key={index}
                            align={column.numeric ? "right" : "left"}
                            padding={column.disablePadding ? "none" : "normal"}
                            sortDirection={orderBy === column.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === column.id}
                                direction={orderBy === column.id ? order : "asc"}
                                onClick={createSortHandler(column.id)}
                            >
                                {column.label}
                                {orderBy === column.id ? (
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
        </>
    );
};

export default SortedTableHead;
