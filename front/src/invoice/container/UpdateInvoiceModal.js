import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {OperationWithConfirmationModal} from "base/ui/modal";
import {ModalOperationStatus} from "base/ui/modal/config";
import {InvoiceService} from "invoice/service";

const UpdateInvoiceModal = ({isOpen = false, onClose, invoice}) => {
    const [operationStatus, setOperationStatus] = useState(ModalOperationStatus.START);
    const [invoiceNewVersion, setInvoiceNewVersion] = useState(null);

    const navigate = useNavigate();

    const closeModal = () => {
        onClose();
    };

    const onClickAccept = () => {
        createNewInvoiceVersion();
    };

    const onClickFinished = () => {
        closeModal();
        navigate(`/facturas/${invoiceNewVersion.id_factura}`);
    };

    const createNewInvoiceVersion = () => {
        setOperationStatus(ModalOperationStatus.PROGRESS);
        InvoiceService.createNewInvoiceVersion(invoice.id_factura)
            .then(invoiceNewVersion => {
                setOperationStatus(ModalOperationStatus.SUCCESS);
                setInvoiceNewVersion(invoiceNewVersion);
            })
            .catch(error => {
                console.log(error);
                setOperationStatus(ModalOperationStatus.ERROR);
            });
    };

    const modalContentStart = (
        <p>
            Esta factura ya ha sido emitida.
            <br /> Si desea modificarla debe crear una nueva versión.
        </p>
    );

    const modalContentFinished =
        "Se ha creado correctamente la nueva versión de la factura.";

    return isOpen ? (
        <OperationWithConfirmationModal
            operationStatus={operationStatus}
            onClose={closeModal}
            onClickAccept={onClickAccept}
            onClickFinished={onClickFinished}
            modalTitle="Modificar factura"
            modalContentStart={modalContentStart}
            modalContentFinished={modalContentFinished}
            modalAcceptText="Crear una nueva versión"
            modalAcceptIcon="file-invoice"
            spinnerMessage="Anulando factura anterior"
            modalErrorText="Se ha producido un error y no se ha podido crear la nueva versión para la factura."
        />
    ) : null;
};

export default UpdateInvoiceModal;
