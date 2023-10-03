import {Link} from "react-router-dom";
import Button from "@mui/material/Button";

const ButtonLink = ({text, to, disabled = false}) => {
    const buttonStyle = {
        textAlign: "center",
        "&a:hover": {
            color: "inherit",
        },
    };

    return (
        <Button
            variant="contained"
            component={Link}
            to={to}
            disabled={disabled}
            sx={buttonStyle}
            fullWidth
        >
            {text}
        </Button>
    );
};

export default ButtonLink;
