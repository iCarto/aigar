import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import PostAddIcon from "@mui/icons-material/PostAdd";

const CreateInvoiceButton = ({onClick = null, disabled = false}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) onClick();
        navigate("nueva_factura");
    };

    return (
        <Button
            variant="contained"
            startIcon={<PostAddIcon fontSize="small" />}
            onClick={handleClick}
            disabled={disabled}
            fullWidth
        >
            Crear factura
        </Button>
    );
};

export default CreateInvoiceButton;
