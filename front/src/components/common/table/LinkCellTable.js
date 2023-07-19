import {useNavigate} from "react-router-dom";

const LinkCellTable = ({row, column, cell}) => {
    const navigate = useNavigate();
    const {linkAccessor} = column.getProps();

    const handleClickLink = () => {
        navigate(`${row.original[linkAccessor]}`);
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
