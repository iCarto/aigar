import {useState} from "react";
import {DeleteMemberModal} from "../presentational";

import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";

const DeleteMemberButton = ({member}) => {
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
                color="warning"
                startIcon={<DeleteIcon fontSize="small" />}
                fullWidth
            >
                Eliminar
            </Button>
            <DeleteMemberModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                member={member}
            />
        </>
    );
};

export default DeleteMemberButton;
