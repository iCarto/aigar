import {useNavigate} from "react-router-dom";

const EditButton = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("modificar");
    };

    return (
        <button onClick={handleClick} className="btn btn-primary mt-1 mb-1">
            <i className="fas fa-edit mr-2" />
            Modificar
        </button>
    );
};

export default EditButton;
