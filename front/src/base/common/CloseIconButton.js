import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const CloseIconButton = ({onClick}) => {
    const handleClick = () => {
        if (onClick) onClick();
    };

    return (
        <IconButton aria-label="clear-filters" onClick={handleClick} title="Cerrar">
            <CloseIcon fontSize="small" />
        </IconButton>
    );
};

export default CloseIconButton;
