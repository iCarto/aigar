import {ModalOperationStatus} from "./config";
import {Modal} from "base/ui/modal";
import {AcceptButton, CancelButton, CloseButton, Spinner} from "base/common";
import Alert from "@mui/material/Alert";

const OperationWithConfirmationModal = ({
    operationStatus,
    modalTitle,
    modalContentStart,
    modalContentFinished,
    modalAcceptText = "",
    modalAcceptIcon = null,
    spinnerMessage = "",
    modalErrorText,
    onClose,
    onClickAccept,
    onClickFinished,
}) => {
    const handleCloseModal = () => {
        if (
            operationStatus === ModalOperationStatus.START ||
            operationStatus === ModalOperationStatus.ERROR
        )
            onClose();
        else return;
    };

    const statusModalViews = [
        {
            status: ModalOperationStatus.START,
            body: modalContentStart,
            footer: (
                <>
                    {<CancelButton onClick={onClose} />}
                    {
                        <AcceptButton
                            onClick={onClickAccept}
                            text={modalAcceptText}
                            icon={modalAcceptIcon}
                        />
                    }
                </>
            ),
        },
        {
            status: ModalOperationStatus.PROGRESS,
            body: <Spinner message={spinnerMessage || "Procesando"} />,
        },
        {
            status: ModalOperationStatus.SUCCESS,
            body: modalContentFinished,
            footer: <CloseButton onClick={onClickFinished} />,
        },
        {
            status: ModalOperationStatus.ERROR,
            body: <Alert severity="error">{modalErrorText}</Alert>,
        },
    ];

    const currentView = statusModalViews.find(view => view.status === operationStatus);

    return (
        <Modal
            isOpen={!!operationStatus}
            onClose={handleCloseModal}
            header={modalTitle}
            body={currentView?.body}
            footer={currentView?.footer}
        />
    );
};

export default OperationWithConfirmationModal;
