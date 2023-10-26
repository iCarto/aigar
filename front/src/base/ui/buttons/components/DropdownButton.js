import {useState} from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const DropdownButton = ({text = "", actions, disabled = false}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id={`${text}-drop-down-button`}
                aria-controls={open ? `${text}-drop-down-menu` : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                variant="contained"
                endIcon={<KeyboardArrowDownIcon />}
                fullWidth
                disabled={disabled}
                sx={{px: 0}}
            >
                {text}
            </Button>
            <Menu
                id={`${text}-drop-down-menu`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": `${text}-drop-down-button`,
                }}
            >
                {actions?.map((action, index) => {
                    return (
                        <MenuItem
                            key={index}
                            onClick={action.onClick}
                            disabled={action.disabled}
                        >
                            {action.text}
                        </MenuItem>
                    );
                })}
            </Menu>
        </div>
    );
};

export default DropdownButton;
