import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const MemberNewButton = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/socios/nuevo/crear");
    };

    return (
        <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{mb: 0.75}}
            startIcon={<PersonAddIcon />}
            onClick={handleClick}
        >
            Nuevo
        </Button>
    );
};

export default MemberNewButton;
