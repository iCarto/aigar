import {cloneElement} from "react";
import Button from "@mui/material/Button";

const AcceptButton = ({text = "", onClick, disabled = false, icon = null}) => {
    const handleClick = () => {
        if (onClick) onClick();
    };

    return (
        <Button
            onClick={handleClick}
            variant="contained"
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

export default AcceptButton;
