import {useNavigate} from "react-router-dom";

const BackButton = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <button onClick={handleBack} className="btn btn-light">
            <i className="fas fa-arrow-left mr-2" />
            Volver
        </button>
    );
};

export default BackButton;
