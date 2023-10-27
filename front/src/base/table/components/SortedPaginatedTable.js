import {useMemo, useState} from "react";

import {useSort} from "../hooks";
import {SortedTableHead} from ".";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";

const SortedPaginatedTable = ({columns, data}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const {
        attribute: orderBy,
        setAttribute: setOrderBy,
        order,
        setOrder,
        sortFunction,
    } = useSort("", ""); // using to empty strings the default sort is taken from backend

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

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
            <TableContainer>
                <Table sx={{minWidth: 750}} aria-labelledby="tableTitle" size={"small"}>
                    <SortedTableHead
                        columns={columns}
                        rowCount={data.length}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                        {visibleRows.map((row, index) => {
                            return (
                                <TableRow
                                    hover
                                    tabIndex={-1}
                                    key={index}
                                    sx={{cursor: "pointer"}}
                                >
                                    {columns.map((column, index) => {
                                        return (
                                            <TableCell
                                                key={index}
                                                id={column.label}
                                                className={column.className || null}
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

export default SortedPaginatedTable;
