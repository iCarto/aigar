import {ModalOperationStatus} from "./config";
import {Modal} from "base/ui/modal";
import {Spinner} from "base/common";

//TO-DO: Migrate to MUI
const OperationWithConfirmationModal = ({
    operationStatus,
    modalTitle,
    modalContentStart,
    modalContentFinished,
    modalAcceptText = "",
    modalAcceptIcon = "",
    spinnerMessage = "",
    modalErrorText,
    onClose,
    onClickAccept,
    onClickFinished,
}) => {
    const handleClose = () => {
        onClose();
    };

    const closeButton = (
        <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={
                operationStatus === ModalOperationStatus.SUCCESS
                    ? onClickFinished
                    : handleClose
            }
        >
            <span aria-hidden="true">&times;</span>
        </button>
    );

    const cancelButton = (
        <button type="button" className="btn btn-secondary" onClick={handleClose}>
            Cancelar
        </button>
    );

    const acceptButton = (
        <button type="button" className="btn btn-primary" onClick={onClickAccept}>
            {modalAcceptIcon ? (
                <i className={`mr-2 fas fa-${modalAcceptIcon}`} />
            ) : null}
            {modalAcceptText || "Aceptar"}
        </button>
    );

    const finishedButton = (
        <button type="button" className="btn btn-primary" onClick={onClickFinished}>
            <i className="fas fa-times mr-2" />
            Cerrar
        </button>
    );

    const statusModalViews = [
        {
            status: ModalOperationStatus.START,
            body: modalContentStart,
            footer: (
                <>
                    {cancelButton}
                    {acceptButton}
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
            footer: finishedButton,
        },
        {
            status: ModalOperationStatus.ERROR,
            body: <p className="alert alert-danger">{modalErrorText}</p>,
        },
    ];

    const currentView = statusModalViews.find(view => view.status === operationStatus);

    const modalHeader = (
        <>
            {modalTitle}
            {operationStatus === ModalOperationStatus.START ||
            operationStatus === ModalOperationStatus.ERROR
                ? closeButton
                : null}
        </>
    );

    return (
        <Modal
            isOpen={!!operationStatus}
            onClose={handleClose}
            header={modalHeader}
            body={currentView?.body}
            footer={currentView?.footer}
        />
    );
};

export default OperationWithConfirmationModal;
