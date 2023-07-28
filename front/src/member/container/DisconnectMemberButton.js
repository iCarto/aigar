import {useState} from "react";
import {DisconnectMemberModal} from ".";
import FormatColorResetIcon from "@mui/icons-material/FormatColorReset";
import Button from "@mui/material/Button";

const DisconnectMemberButton = ({member}) => {
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
                startIcon={<FormatColorResetIcon fontSize="small" />}
                fullWidth
            >
                Desconectar
            </Button>
            <DisconnectMemberModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                member={member}
            />
        </>
    );
};

export default DisconnectMemberButton;
