import Button from "@mui/material/Button";

const CancelButton = ({text = "", onClick, disabled = false}) => {
    const handleClick = () => {
        if (onClick) onClick();
    };

    return (
        <Button onClick={handleClick} variant="outlined" disabled={disabled}>
            {text || "Cancelar"}
        </Button>
    );
};

export default CancelButton;
