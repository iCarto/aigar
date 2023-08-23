import {useMemo, useState} from "react";

import {useSort} from "../hooks";
import {SortedTableHead, TableToolbar} from ".";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import Checkbox from "@mui/material/Checkbox";

const SortedPaginatedSelectableTable = ({
    columns,
    data,
    selectAttribute,
    tableActions = [],
}) => {
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const {
        attribute: orderBy,
        setAttribute: setOrderBy,
        order,
        setOrder,
        sortFunction,
    } = useSort("id", "asc");

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelected = data.map(item => item[selectAttribute]);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, item) => {
        const selectedIndex = selected.indexOf(item);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, item);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
    };

    const isSelected = item => selected.indexOf(item) !== -1;

    // Avoid a layout jump when reaching the last page with empty data.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const visibleRows = useMemo(
        () =>
            data
                .sort(sortFunction)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage, data]
    );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            <TableToolbar totalSelected={selected.length} tableActions={tableActions} />
            <TableContainer>
                <Table sx={{minWidth: 750}} aria-labelledby="tableTitle" size={"small"}>
                    <SortedTableHead
                        columns={columns}
                        totalSelected={selected.length}
                        rowCount={data.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                        {visibleRows.map((row, index) => {
                            const isItemSelected = isSelected(row[selectAttribute]);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    onClick={event =>
                                        handleClick(event, row[selectAttribute])
                                    }
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={index}
                                    selected={isItemSelected}
                                    sx={{cursor: "pointer"}}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isItemSelected}
                                            inputProps={{
                                                "aria-labelledby": labelId,
                                            }}
                                        />
                                    </TableCell>
                                    {columns.map((column, index) => {
                                        // TO-DO: We are mixing classes (for units) & inline style --Fix
                                        return (
                                            <TableCell
                                                key={index}
                                                id={column.label}
                                                className={column.className || null}
                                                sx={column.style || {}}
                                            >
                                                {column.formatFunction
                                                    ? column.formatFunction(row)
                                                    : row[column.id]}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                        {emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: 33 * emptyRows,
                                }}
                            >
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
};

export default SortedPaginatedSelectableTable;
