import {useState} from "react";

import {ActionConfirmationModal} from "base/ui/modal/components";
import {MenuAction} from "base/ui/menu/components";
import {TableAction} from "base/table/components";

import DeleteIcon from "@mui/icons-material/Delete";

export const useDeleteActionHook = (service, selectedItems) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClickDelete = () => {
        console.log("Eliminar", selectedItems);
        setIsModalOpen(true);
    };

    const handleDelete = items => {
        // service.delete(items);
        console.log(items);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const menuAction = (
        <MenuAction
            key="table-delete-action"
            icon={<DeleteIcon color="error" />}
            text="Eliminar"
            handleClick={handleClickDelete}
        />
    );

    const tableAction = (
        <TableAction
            id="delete"
            icon={<DeleteIcon />}
            title="Eliminar"
            selectedItems={selectedItems}
            handleClick={handleClickDelete}
        />
    );

    const itemLabel = selectedItems.length === 1 ? "elemento" : "elementos";

    const modalMessages = {
        confirmation: "¿Desea eliminar estos elementos?",
        success: "Se han eliminado los elementos del sistema.",
        title: `Eliminar ${itemLabel}`,
    };

    const modal = (
        <ActionConfirmationModal
            items={selectedItems}
            isOpen={isModalOpen}
            onClose={closeModal}
            onConfirm={handleDelete}
            messages={modalMessages}
        />
    );

    return {menuAction, tableAction, modal, handleClickDelete};
};
