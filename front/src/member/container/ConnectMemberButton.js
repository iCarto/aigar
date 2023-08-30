import {useState} from "react";
import {ConnectMemberModal} from ".";
import Button from "@mui/material/Button";
import WaterDropIcon from "@mui/icons-material/WaterDrop";

const ConnectMemberButton = ({member, onUpdateStatus}) => {
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
                member={member}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onUpdateStatus={onUpdateStatus}
            />
        </>
    );
};

export default ConnectMemberButton;
