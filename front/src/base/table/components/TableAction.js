import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import Tooltip from "@mui/material/Tooltip";

const TableAction = ({
    selectedItems,
    id = "",
    icon,
    title,
    handleClick = null,
    disabled = false,
}) => {
    const handleClickAction = () => {
        handleClick(selectedItems);
    };

    return (
        <Tooltip
            title={title}
            placement="top"
            onClick={disabled ? null : handleClickAction}
        >
            <ListItem aria-label={id} disablePadding>
                <IconButton disabled={disabled}>{icon}</IconButton>
            </ListItem>
        </Tooltip>
    );
};

export default TableAction;
