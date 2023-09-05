import Button from "@mui/material/Button";

const CloseButton = ({text = "", onClick, disabled = false}) => {
    const handleClick = () => {
        if (onClick) onClick();
    };

    return (
        <Button onClick={handleClick} variant="outlined" disabled={disabled}>
            {text || "Cerrar"}
        </Button>
    );
};

export default CloseButton;
