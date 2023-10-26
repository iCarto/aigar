import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {OperationWithConfirmationModal} from "base/ui/modal/components";
import {ModalOperationStatus} from "base/ui/modal/config";
import {InvoiceService} from "invoice/service";
import Alert from "@mui/material/Alert";
import DescriptionIcon from "@mui/icons-material/Description";

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
        navigate(`/facturas/${invoiceNewVersion.id}`);
    };

    const createNewInvoiceVersion = () => {
        setOperationStatus(ModalOperationStatus.PROGRESS);
        InvoiceService.createNewInvoiceVersion(invoice.id)
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

    const modalContentFinished = (
        <Alert severity="success">
            Se ha creado correctamente la nueva versión de la factura.
        </Alert>
    );

    return isOpen ? (
        <OperationWithConfirmationModal
            operationStatus={operationStatus}
            onClose={closeModal}
            onClickAccept={onClickAccept}
            onClickFinished={onClickFinished}
            modalTitle="Crear nueva versión"
            modalContentStart={modalContentStart}
            modalContentFinished={modalContentFinished}
            modalAcceptText="Crear una nueva versión"
            modalAcceptIcon={<DescriptionIcon />}
            spinnerMessage="Anulando factura anterior"
            modalErrorText="Se ha producido un error y no se ha podido crear la nueva versión para la factura."
        />
    ) : null;
};

export default UpdateInvoiceModal;
