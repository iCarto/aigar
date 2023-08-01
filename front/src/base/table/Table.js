import {useTable} from "react-table";

const Table = ({columns, data, onUpdateData}) => {
    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable(
        {columns, data, onUpdateData}
    );

    return (
        <table
            {...getTableProps()}
            className="table table-bordered table-striped table-hover"
        >
            <thead className="thead-dark">
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>
                                {column.render("Header")}
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
    );
};

export default Table;
