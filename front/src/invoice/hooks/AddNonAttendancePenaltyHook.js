import {useState} from "react";
import {TableAction} from "base/table/components";
import {ActionConfirmationModal} from "base/common";
import GroupsIcon from "@mui/icons-material/Groups";

export const useAddNonAttendancePenaltyHook = (
    service,
    selectedItems,
    refreshTable
) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClickAction = () => {
        setIsModalOpen(true);
    };

    const handleAction = items => {
        return new Promise(() => {
            service
                .addNonAttendancePenalty(items)
                .then(response => {
                    refreshTable();
                })
                .catch(error => {
                    console.log(error);
                });
        });
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
            "Se ha asignado la penalización por inasistencia a asamblea a las facturas seleccionadas.",
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
