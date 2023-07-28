import {useState} from "react";
import {ConnectMemberModal} from ".";
import Button from "@mui/material/Button";
import WaterDropIcon from "@mui/icons-material/WaterDrop";

const ConnectMemberButton = ({member}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button
                onClick={handleClick}
                variant="contained"
                startIcon={<WaterDropIcon fontSize="small" />}
                fullWidth
            >
                Conectar
            </Button>
            <ConnectMemberModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                member={member}
            />
        </>
    );
};

export default ConnectMemberButton;
