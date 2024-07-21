import {useState} from "react";
import {DeleteMemberModal} from "../presentational";

import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";

const DeleteMemberButton = ({member, onUpdateStatus}) => {
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
                startIcon={<DeleteIcon fontSize="small" />}
                fullWidth
            >
                Eliminar
            </Button>
            <DeleteMemberModal
                member={member}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onUpdateStatus={onUpdateStatus}
            />
        </>
    );
};

export default DeleteMemberButton;
