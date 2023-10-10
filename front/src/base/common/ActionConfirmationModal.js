import {useState} from "react";
import {useLocation} from "react-router-dom";

import ErrorUtil from "base/error/utilities/ErrorUtil";
import {ModalOperationStatus} from "base/ui/modal/config";
import {useNavigateWithReload} from "base/navigation/hooks";
import {OperationWithConfirmationModal} from "base/ui/modal";

import Alert from "@mui/material/Alert";

const ActionConfirmationModal = ({
    items,
    isOpen = false,
    onClose,
    onConfirm,
    messages,
}) => {
    const [operationStatus, setOperationStatus] = useState(ModalOperationStatus.START);
    const [error, setError] = useState("");
    const location = useLocation();

    const navigate = useNavigateWithReload();

    const closeModal = () => {
        onClose();
    };

    const onClickAccept = () => {
        confirmAction();
    };

    const onClickFinished = () => {
        closeModal();
        navigate(location.pathname, true);
    };

    const confirmAction = () => {
        setOperationStatus(ModalOperationStatus.PROGRESS);
        onConfirm(items)
            .then(response => {
                setOperationStatus(ModalOperationStatus.SUCCESS);
            })
            .catch(error => {
                console.log(error);
                setError(error);
                setOperationStatus(ModalOperationStatus.ERROR);
            });
    };

    const modalContentStart = <Alert severity="warning">{messages.confirmation}</Alert>;

    const modalContentFinished = messages.success;
    const errorMessage = error ? ErrorUtil.getMessage(error) : null;

    return isOpen ? (
        <OperationWithConfirmationModal
            operationStatus={operationStatus}
            onClose={closeModal}
            onClickAccept={onClickAccept}
            onClickFinished={onClickFinished}
            modalTitle={messages.title}
            modalContentStart={modalContentStart}
            modalContentFinished={modalContentFinished}
            modalErrorText={errorMessage}
        />
    ) : null;
};

export default ActionConfirmationModal;
