import React from "react";
import {useTable, useSortBy} from "react-table";

const SortedTable = ({columns, data, onUpdateData}) => {
    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable(
        {
            columns,
            data,
            onUpdateData,
        },
        useSortBy
    );

    return (
        <>
            <table
                {...getTableProps()}
                className="table table-bordered table-striped table-hover"
            >
                <thead className="thead-dark">
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th
                                    {...column.getHeaderProps(
                                        column.getSortByToggleProps()
                                    )}
                                >
                                    {column.render("Header")}
                                    {/* Add a sort direction indicator */}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? " 🔽"
                                                : " 🔼"
                                            : ""}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <td
                                            {...cell.getCellProps([
                                                {
                                                    className: cell.column.className,
                                                    style: cell.column.style,
                                                },
                                            ])}
                                        >
                                            {cell.render("Cell")}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
};

export default SortedTable;
