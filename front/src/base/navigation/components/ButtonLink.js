import {Link} from "react-router-dom";
import Button from "@mui/material/Button";

const ButtonLink = ({text, to, disabled = false}) => {
    return (
        <Button
            variant="contained"
            component={Link}
            to={to}
            disabled={disabled}
            sx={{textAlign: "center"}}
            fullWidth
        >
            {text}
        </Button>
    );
};

export default ButtonLink;
