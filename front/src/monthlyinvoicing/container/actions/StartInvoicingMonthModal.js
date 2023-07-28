import {useState} from "react";
import {useLocation} from "react-router-dom";
import {InvoicingMonthService} from "monthlyinvoicing/service";
import {ModalOperationStatus} from "base/ui/modal/config";
import {useNavigateWithReload} from "base/navigation/hooks";
import {DateUtil} from "utilities";
import {OperationWithConfirmationModal} from "base/ui/modal";

const StartInvoicingMonthModal = ({invoicingMonth, isOpen = false, onClose}) => {
    const [operationStatus, setOperationStatus] = useState(ModalOperationStatus.START);
    const [errorMessage, setErrorMessage] = useState(null);

    const navigate = useNavigateWithReload();
    const location = useLocation();
    const basePath = location.pathname;

    const closeModal = () => {
        onClose();
    };

    const onClickAccept = () => {
        startInvoicingMonth();
    };

    const onClickFinished = () => {
        closeModal();
        navigate(basePath, true);
    };

    const startInvoicingMonth = () => {
        console.log("StartInvoicingMonthModal.startInvoicingMonth");
        setOperationStatus(ModalOperationStatus.PROGRESS);
        setErrorMessage(null);

        InvoicingMonthService.startInvoicingMonth(invoicingMonth, false)
            .then(invoicingMonth => {
                setOperationStatus(ModalOperationStatus.SUCCESS);
                setErrorMessage(null);
            })
            .catch(error => {
                console.log(error);
                setOperationStatus(ModalOperationStatus.ERROR);
                setErrorMessage(error);
            });
    };

    const modalContentStart = (
        <p>
            ¿Desea iniciar la facturación del mes de&nbsp;
            <strong>
                {DateUtil.getMonthName(invoicingMonth.mes)} - {invoicingMonth.anho}
            </strong>
            ?
        </p>
    );

    const modalContentFinished = `Las facturas del mes de ${DateUtil.getMonthName(
        invoicingMonth.mes
    )} - ${invoicingMonth.anho} se han creado correctamente.`;

    const modalContentError = (
        <>
            Se ha producido un error y no se han podido crear las facturas.
            <br />
            <strong>{errorMessage ? errorMessage.message : null}</strong>
        </>
    );

    return isOpen ? (
        <OperationWithConfirmationModal
            operationStatus={operationStatus}
            onClose={closeModal}
            onClickAccept={onClickAccept}
            onClickFinished={onClickFinished}
            modalTitle="Iniciar mes de facturación"
            modalContentStart={modalContentStart}
            modalContentFinished={modalContentFinished}
            modalAcceptText="Iniciar"
            modalAcceptIcon="file-invoice"
            spinnerMessage="Generando facturas"
            modalErrorText={modalContentError}
        />
    ) : null;
};

export default StartInvoicingMonthModal;
