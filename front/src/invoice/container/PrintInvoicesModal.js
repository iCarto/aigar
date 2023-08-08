import {useState} from "react";
import {DocXPrintFileService, FileService} from "base/file/service";
import {InvoiceService} from "invoice/service";
import {ESTADOS_FACTURA} from "invoice/model";
import {ModalOperationStatus} from "base/ui/modal/config";
import {OperationWithConfirmationModal} from "base/ui/modal";
import {useNavigateWithReload} from "base/navigation/hooks";

const PrintInvoicesModal = ({isOpen = false, onClose, invoices, outputFilename}) => {
    const [operationStatus, setOperationStatus] = useState(ModalOperationStatus.START);
    const [errorMessage, setErrorMessage] = useState(null);

    const printInvoices = async () => {
        setOperationStatus(ModalOperationStatus.PROGRESS);
        setErrorMessage(null);

        try {
            const data = {
                invoices: invoices,
            };
            const invoicesDocument = await DocXPrintFileService.generateInvoicesDocument(
                data,
                outputFilename
            );
            FileService.saveDataToFile(
                invoicesDocument,
                outputFilename + ".docx",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            );
            const invoiceIdsToUpdate = invoices
                .filter(invoice => invoice.estado === ESTADOS_FACTURA.NUEVA)
                .map(invoice => invoice.id_factura);

            InvoiceService.updateInvoiceStatus(
                invoiceIdsToUpdate,
                ESTADOS_FACTURA.PENDIENTE_DE_COBRO
            )
                .then(result => {
                    setOperationStatus(ModalOperationStatus.SUCCESS);
                    setErrorMessage(null);
                })
                .catch(error => {
                    console.log(error);
                    setOperationStatus(ModalOperationStatus.ERROR);
                    setErrorMessage(
                        "No se ha podido actualizar el estado de la factura."
                    );
                });
        } catch (error) {
            console.log(error);
            setOperationStatus(ModalOperationStatus.ERROR);
            setErrorMessage("No se ha podido generar el documento.");
        }
    };

    const handleClose = () => {
        setErrorMessage(null);
        onClose();
    };

    const handleClickAccept = () => {
        printInvoices();
    };

    const navigate = useNavigateWithReload();

    const handleClickFinished = () => {
        navigate("", true);
        setOperationStatus(ModalOperationStatus.START);
        handleClose();
    };

    const modalContentStart = (
        <p>
            Procederá a imprimir{" "}
            {invoices && invoices.length === 1 ? "la factura" : "las facturas"}. ¿Ha
            revisado previamente si es necesario añadir otros importes, como asambleas,
            nuevos derechos, reconexiones, traspasos...?
        </p>
    );

    const modalContentFinished = (
        <p className="alert alert-success">
            El documento se ha generado correctamente.
        </p>
    );

    const modalContentError = (
        <>
            Se ha producido un error y no se han podido generar el documento.
            <br />
            <strong>{errorMessage ? errorMessage.message : null}</strong>
        </>
    );

    return isOpen ? (
        <OperationWithConfirmationModal
            operationStatus={operationStatus}
            onClose={handleClose}
            onClickAccept={handleClickAccept}
            onClickFinished={handleClickFinished}
            modalTitle="Imprimir facturas"
            modalContentStart={modalContentStart}
            modalContentFinished={modalContentFinished}
            modalAcceptText="Imprimir"
            modalAcceptIcon="print"
            spinnerMessage="Generando documento"
            modalErrorText={modalContentError}
        />
    ) : null;
};

export default PrintInvoicesModal;
