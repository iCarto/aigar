import {ModalOperationStatus} from "./config";
import {Modal} from "base/ui/modal";
import {
    AcceptButton,
    CancelButton,
    CloseButton,
    CloseIconButton,
    Spinner,
} from "base/common";
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

    const modalHeader = (
        <>
            {modalTitle}
            {operationStatus === ModalOperationStatus.START ||
            operationStatus === ModalOperationStatus.ERROR ? (
                <CloseIconButton
                    onClick={
                        operationStatus === ModalOperationStatus.SUCCESS
                            ? onClickFinished
                            : onClose
                    }
                />
            ) : null}
        </>
    );

    return (
        <Modal
            isOpen={!!operationStatus}
            onClose={onClose}
            header={modalHeader}
            body={currentView?.body}
            footer={currentView?.footer}
        />
    );
};

export default OperationWithConfirmationModal;
