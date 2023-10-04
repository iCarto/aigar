import {Link} from "react-router-dom";
import Button from "@mui/material/Button";

const ButtonLink = ({
    text,
    to,
    disabled = false,
    fullWidth = true,
    openNewTab = false,
}) => {
    const buttonStyle = {
        textAlign: "center",
        "&a:hover": {
            color: "inherit",
        },
    };

    return (
        <Button
            to={to}
            variant="contained"
            component={Link}
            disabled={disabled}
            sx={buttonStyle}
            fullWidth={fullWidth}
            target={openNewTab ? "_blank" : null}
        >
            {text}
        </Button>
    );
};

export default ButtonLink;
