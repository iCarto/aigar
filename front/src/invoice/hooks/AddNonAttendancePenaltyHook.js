import {useState} from "react";
import {TableAction} from "base/table/components";
import {ActionConfirmationModal} from "base/common";
import GroupsIcon from "@mui/icons-material/Groups";

export const useAddNonAttendancePenaltyHook = (service, selectedItems) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClickAction = () => {
        console.log("Asignar penalización por inasistencia a asamblea", selectedItems);
        setIsModalOpen(true);
    };

    const handleAction = items => {
        // service.addNonAttendancePenalty(items);
        console.log(items);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const tableAction = (
        <TableAction
            id="add-non-attendance-penalty"
            icon={<GroupsIcon />}
            title="Asignar inasistencia a asamblea"
            handleClick={handleClickAction}
            selectedItems={selectedItems}
        />
    );

    const modalMessages = {
        confirmation:
            "¿Desea asignar penalización por inasistencia a asamblea a las facturas seleccionadas?",
        success:
            "Se ha asignado la pensalización por inasistencia a asamblea a las facturas seleccionadas.",
        title: "Asignar penalización por inasistencia a asamblea",
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
