import {useState} from "react";
import {useLocation} from "react-router-dom";
import {InvoicingMonthService} from "monthlyinvoicing/service";
import {ModalOperationStatus} from "base/ui/modal/config";
import {useNavigateWithReload} from "base/navigation/hooks";
import {DateUtil} from "base/format/utilities";
import {OperationWithConfirmationModal} from "base/ui/modal";
import {useMonthlyInvoicingList} from "monthlyinvoicing/provider";

const StartInvoicingMonthModal = ({invoicingMonth, isOpen = false, onClose}) => {
    const [operationStatus, setOperationStatus] = useState(ModalOperationStatus.START);
    const [errorMessage, setErrorMessage] = useState(null);

    const navigate = useNavigateWithReload();
    const location = useLocation();
    const basePath = location.pathname;

    const {setIsDataUpdated} = useMonthlyInvoicingList();

    const handleClickAccept = () => {
        startInvoicingMonth();
    };

    const handleClickFinished = () => {
        onClose();
        navigate(basePath, true);
    };

    const startInvoicingMonth = () => {
        setOperationStatus(ModalOperationStatus.PROGRESS);
        setErrorMessage(null);

        InvoicingMonthService.startInvoicingMonth(invoicingMonth, false)
            .then(() => {
                setOperationStatus(ModalOperationStatus.SUCCESS);
                setErrorMessage(null);
                setIsDataUpdated(prevState => !prevState);
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
            onClose={onClose}
            onClickAccept={handleClickAccept}
            onClickFinished={handleClickFinished}
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
