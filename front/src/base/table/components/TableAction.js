import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import Tooltip from "@mui/material/Tooltip";

const TableAction = ({selectedItems, id = "", icon, title, handleClick = null}) => {
    const handleClickAction = () => {
        handleClick(selectedItems);
    };

    return (
        <ListItem aria-label={id} onClick={handleClickAction} disablePadding>
            <Tooltip title={title} placement="top">
                <IconButton>{icon}</IconButton>
            </Tooltip>
        </ListItem>
    );
};

export default TableAction;
