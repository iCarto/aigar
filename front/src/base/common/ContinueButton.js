import Button from "@mui/material/Button";

const ContinueButton = ({text = "", onClick, disabled = false}) => {
    const handleClick = () => {
        if (onClick) onClick();
    };

    return (
        <Button onClick={handleClick} variant="contained" disabled={disabled}>
            {text || "Continuar"}
        </Button>
    );
};

export default ContinueButton;
