import {useEffect} from "react";
import {useTable, useSortBy, usePagination} from "react-table";

import {useList} from "base/entity/provider";
import {PaginatedTableNavigator} from ".";

const SortedPaginatedTable = ({columns, data, onUpdateData = null}) => {
    const {
        pageSize,
        pageIndex: controlledPageIndex,
        setPageIndex,
        sortBy: controlledSortBy,
        setSortBy,
    } = useList();

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
                pageSize: pageSize,
                pageIndex: controlledPageIndex,
                sortBy: controlledSortBy,
            },
            onUpdateData,
        },
        useSortBy,
        usePagination
    );

    // Listening for changes in pagination or sorting and lifting them up to ListProvider
    useEffect(() => {
        setPageIndex(pageIndex);
        setSortBy(sortBy);
    }, [pageIndex, sortBy]);

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
                length={data.length}
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
