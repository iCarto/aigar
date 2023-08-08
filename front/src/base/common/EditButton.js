import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";

const EditButton = ({text = "", onClick = null, disabled = false}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) onClick();
        else navigate("modificar");
    };

    return (
        <Button
            onClick={handleClick}
            variant="contained"
            startIcon={<EditIcon fontSize="small" />}
            disabled={disabled}
            fullWidth
        >
            {text || "Modificar"}
        </Button>
    );
};

export default EditButton;
