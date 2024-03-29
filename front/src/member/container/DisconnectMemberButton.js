import {useState} from "react";
import {DisconnectMemberModal} from ".";
import FormatColorResetIcon from "@mui/icons-material/FormatColorReset";
import Button from "@mui/material/Button";

const DisconnectMemberButton = ({member, onUpdateStatus}) => {
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
                variant="outlined"
                color="error"
                startIcon={<FormatColorResetIcon fontSize="small" />}
                fullWidth
            >
                Desactivar
            </Button>
            <DisconnectMemberModal
                member={member}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onUpdateStatus={onUpdateStatus}
            />
        </>
    );
};

export default DisconnectMemberButton;
