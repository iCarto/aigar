import {useState} from "react";
import {TableAction} from "base/table/components";
import {ActionConfirmationModal} from "base/common";
import ConstructionIcon from "@mui/icons-material/Construction";

export const useAddWorkingDayPenaltyHook = (service, selectedItems, refreshTable) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClickAction = () => {
        setIsModalOpen(true);
    };

    const handleAction = items => {
        return new Promise(() => {
            service
                .addWorkingDayPenaltyPenalty(items)
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
            id="add-working-day-penalty"
            icon={<ConstructionIcon />}
            title="Asignar penalización por jornada de trabajo"
            handleClick={handleClickAction}
            selectedItems={selectedItems}
        />
    );

    const modalMessages = {
        confirmation:
            "¿Desea asignar penalización por jornada de trabajo a las facturas seleccionadas?",
        success:
            "Se ha asignado la penalización por jornada de trabajo a las facturas seleccionadas.",
        title: "Asignar penalización por jornada de trabajo",
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
