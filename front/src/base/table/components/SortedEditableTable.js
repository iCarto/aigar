import {useTable, useSortBy} from "react-table";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";

const SortedEditableTable = ({columns, data, onUpdateData}) => {
    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable(
        {
            columns,
            data,
            onUpdateData,
        },
        useSortBy
    );

    return (
        <Table {...getTableProps()} size="small">
            <TableHead>
                {headerGroups.map(headerGroup => (
                    <TableRow {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <TableCell
                                {...column.getHeaderProps(
                                    column.getSortByToggleProps()
                                )}
                                sx={{verticalAlign: "top", lineHeight: 1.5}}
                            >
                                {column.render("Header")}
                                {column.canSort && (
                                    <TableSortLabel
                                        active={column.isSorted}
                                        direction={column.isSortedDesc ? "desc" : "asc"}
                                    />
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <TableRow {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return (
                                    <TableCell
                                        {...cell.getCellProps([
                                            {
                                                className: cell.column.className,
                                                style: cell.column.style,
                                            },
                                        ])}
                                    >
                                        {cell.render("Cell")}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default SortedEditableTable;
