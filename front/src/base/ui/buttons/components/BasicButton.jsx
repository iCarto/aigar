import {cloneElement} from "react";
import Button from "@mui/material/Button";

const BasicButton = ({
    text = "",
    onClick,
    icon = null,
    variant = "contained",
    disabled = false,
}) => {
    const handleClick = () => {
        if (onClick) onClick();
    };

    return (
        <Button
            onClick={handleClick}
            variant={variant}
            startIcon={
                icon
                    ? cloneElement(icon, {
                          fontSize: "small",
                          sx: {...icon?.props?.sx},
                      })
                    : null
            }
            disabled={disabled}
        >
            {text || "Aceptar"}
        </Button>
    );
};

export default BasicButton;
