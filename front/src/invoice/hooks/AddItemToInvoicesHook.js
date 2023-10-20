import {useState} from "react";
import {TableAction} from "base/table/components";
import {ActionConfirmationModal} from "base/common";
import {Modal} from "base/ui/modal";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

export const useItemToInvoicesHook = ({
    invoiceItemName,
    invoiceItemIcon,
    actionToPerform,
    invoicesToUpdate,
    refreshTable,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClickAction = () => {
        setIsModalOpen(true);
    };

    const handleAction = items => {
        return new Promise(() => {
            actionToPerform(items)
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
            id={`asignar-${invoiceItemName.replace(/ /g, "-")}`}
            icon={invoiceItemIcon}
            title={`Asignar ${invoiceItemName}`}
            handleClick={handleClickAction}
            selectedItems={invoicesToUpdate}
        />
    );

    const totalInvoicesToUpdate = invoicesToUpdate.length;

    const getConfirmationMessage = () => {
        if (totalInvoicesToUpdate)
            return (
                <Stack>
                    <Typography>
                        ¿Desea asignar {invoiceItemName} a las facturas seleccionadas?
                    </Typography>
                    <Typography variant="subtitle2" mt={2}>
                        Solo se modificarán las facturas nuevas ({totalInvoicesToUpdate}
                        ).
                    </Typography>
                </Stack>
            );
        return (
            <Alert severity="error">
                No se pueden modificar las facturas seleccionadas porque ya han sido
                imprimidas.
            </Alert>
        );
    };

    const modalMessages = {
        title: `Asignar ${invoiceItemName}`,
        confirmation: getConfirmationMessage(),
    };

    const modal = totalInvoicesToUpdate ? (
        <ActionConfirmationModal
            items={invoicesToUpdate}
            isOpen={isModalOpen}
            onClose={closeModal}
            onConfirm={handleAction}
            messages={modalMessages}
        />
    ) : (
        <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            header={modalMessages.title}
            body={modalMessages.confirmation}
        />
    );

    return {tableAction, modal, handleClickAction};
};
