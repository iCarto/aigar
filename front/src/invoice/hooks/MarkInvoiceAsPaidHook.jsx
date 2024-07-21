import {useState} from "react";
import {ActionConfirmationModal} from "base/ui/modal/components";
import {TableAction} from "base/table/components";

import TaskAltIcon from "@mui/icons-material/TaskAlt";
import TaskIcon from "@mui/icons-material/Task";

export const useMarkInvoiceAsPaidHook = (service, selectedItems) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClickAction = () => {
        console.log("Marcar pagadas", selectedItems);
        setIsModalOpen(true);
    };

    const handleAction = items => {
        // service.markAsPaid(items);
        console.log(items);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const tableAction = (
        <TableAction
            id="mark-as-paid"
            icon={<TaskIcon />}
            title="Marcar como pagada"
            selectedItems={selectedItems}
            handleClick={handleClickAction}
        />
    );

    const modalMessages = {
        confirmation: "¿Desea marcar estos recibos como pagados?",
        success: "Los recibos se han marcado como pagados.",
        title: "Marcar recibos como pagados",
    };

    const modal = (
        <ActionConfirmationModal
            items={selectedItems}
            isOpen={isModalOpen}
            onClose={closeModal}
            onConfirm={handleAction}
            messages={modalMessages}
        />
    );

    return {tableAction, modal, handleClickAction};
};
