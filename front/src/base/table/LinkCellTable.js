import {useNavigate} from "react-router-dom";

const LinkCellTable = ({row, column, cell}) => {
    const navigate = useNavigate();
    const {linkAccessor, path} = column.getProps();

    const url = path
        ? `${path}/${row.original[linkAccessor]}`
        : `${row.original[linkAccessor]}`;

    const handleClickLink = () => {
        navigate(url);
    };

    return (
        <button
            type="button"
            className="link-button font-weight-bold"
            onClick={handleClickLink}
        >
            {cell.value}
        </button>
    );
};

export default LinkCellTable;
