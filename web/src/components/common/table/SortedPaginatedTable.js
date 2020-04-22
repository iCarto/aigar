import React, {useEffect} from "react";
import {useTable, useSortBy, usePagination} from "react-table";
import PaginatedTableNavigator from "./PaginatedTableNavigator";

const SortedPaginatedTable = ({
    columns,
    data,
    listView,
    handleChangeListView,
    onUpdateData,
}) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        state: {pageIndex, sortBy},
    } = useTable(
        {
            columns,
            data,
            initialState: {
                pageSize: 12,
                pageIndex: listView ? listView.pageIndex : 0,
                sortBy: listView ? listView.sortBy : [],
            },
            onUpdateData,
        },
        useSortBy,
        usePagination
    );

    // Listening for changes in pagination or sorting and lifting up them
    useEffect(() => {
        if (handleChangeListView) {
            handleChangeListView({pageIndex, sortBy});
        }
    }, [pageIndex, sortBy, handleChangeListView]);

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
                    {page.map((row, i) => {
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
            <PaginatedTableNavigator
                canPreviousPage={canPreviousPage}
                previousPage={previousPage}
                canNextPage={canNextPage}
                nextPage={nextPage}
                gotoPage={gotoPage}
                pageIndex={pageIndex}
                pageCount={pageCount}
                pageOptions={pageOptions}
            />
        </>
    );
};

export default SortedPaginatedTable;
