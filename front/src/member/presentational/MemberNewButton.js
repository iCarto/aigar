import {useNavigate} from "react-router-dom";

const MemberNewButton = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/socios/nuevo/crear");
    };

    return (
        <button onClick={handleClick} className="btn btn-primary mb-1 mt-1">
            <i className="fas fa-user-plus" /> Nuevo socio
        </button>
    );
};

export default MemberNewButton;
