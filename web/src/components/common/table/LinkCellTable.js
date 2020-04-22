import React from "react";

const LinkCellTable = ({row, column, cell}) => (
    <button
        type="button"
        className="link-button font-weight-bold"
        onClick={() => {
            column.getProps().handleClick(row.original[column.getProps().linkAccessor]);
        }}
    >
        {cell.value}
    </button>
);

export default LinkCellTable;
