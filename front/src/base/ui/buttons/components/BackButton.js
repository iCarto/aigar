import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

const BackButton = ({path = ""}) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (path) {
            navigate(path);
        } else navigate(-1);
    };

    return (
        <Button onClick={handleBack} variant="outlined" fullWidth>
            <ArrowLeftIcon />
            Volver
        </Button>
    );
};

export default BackButton;
