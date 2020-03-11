import React, {useEffect} from "react";
import {useTable, useSortBy, usePagination} from "react-table";
import PaginatedTableNavigator from "./PaginatedTableNavigator";

const SortedPaginatedTable = ({
    columns,
    data,
    selectedPageIndex,
    handleChangePageIndex,
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
        state: {pageIndex},
    } = useTable(
        {
            columns,
            data,
            initialState: {
                pageSize: 15,
                pageIndex: selectedPageIndex,
            },
        },
        useSortBy,
        usePagination
    );

    // Listening for changes in pagination and lifting up them
    useEffect(() => {
        handleChangePageIndex(pageIndex);
    }, [pageIndex, handleChangePageIndex]);

    return (
        <>
            <table {...getTableProps()} className="table table-bordered">
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
                                        <td {...cell.getCellProps()}>
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
