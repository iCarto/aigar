import {useState} from "react";
import {DocXPrintFileService, FileService} from "base/file/service";
import {InvoiceService} from "invoice/service";
import {ESTADOS_FACTURA} from "invoice/model";
import {useDomain} from "aigar/domain/provider";
import {ModalOperationStatus} from "base/ui/modal/config";
import {useGetSectorReadingDay} from "aigar/domain/hooks";
import {OperationWithConfirmationModal} from "base/ui/modal";
import Alert from "@mui/material/Alert";
import PrintIcon from "@mui/icons-material/Print";
import AlertTitle from "@mui/material/AlertTitle";
import {DateUtil} from "base/format/utilities";

const PrintInvoicesModal = ({
    invoices,
    isOpen = false,
    onDataUpdate = null,
    onClose,
    outputFilename,
}) => {
    const [operationStatus, setOperationStatus] = useState(ModalOperationStatus.START);
    const [errorMessage, setErrorMessage] = useState(null);

    const {basicConfig} = useDomain();

    // Basic config is always a list with one single object
    const communityName = basicConfig[0]?.name;

    const getReadingDay = useGetSectorReadingDay;

    const formatedInvoices = invoices.map(invoice => {
        const readingDay = getReadingDay(invoice.sector);
        return {
            ...invoice,
            nombre_junta: communityName,
            fecha_lectura: `${readingDay}/${invoice.mes_facturado}/${invoice.anho}`,
            due_date: DateUtil.format(invoice.due_date),
        };
    });

    const printInvoices = async () => {
        setOperationStatus(ModalOperationStatus.PROGRESS);
        setErrorMessage(null);

        try {
            const data = {
                invoices: formatedInvoices,
            };
            const invoicesDocument =
                await DocXPrintFileService.generateInvoicesDocument(
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
                .map(invoice => invoice.id);

            InvoiceService.updateInvoiceStatus(
                invoiceIdsToUpdate,
                ESTADOS_FACTURA.PENDIENTE_DE_COBRO
            )
                .then(result => {
                    setOperationStatus(ModalOperationStatus.SUCCESS);
                    setErrorMessage(null);
                    if (onDataUpdate) onDataUpdate();
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

    const handleClickFinished = () => {
        setOperationStatus(ModalOperationStatus.START);
        handleClose();
    };

    const modalContentStart = (
        <Alert severity="warning" sx={{marginTop: 2}}>
            <AlertTitle>
                A continuación procederá a imprimir{" "}
                {invoices && invoices.length === 1 ? "la factura" : "las facturas"}.
            </AlertTitle>
            ¿Ha revisado previamente si es necesario añadir otros importes, como
            asambleas, nuevos derechos, reconexiones, traspasos...?
        </Alert>
    );

    const modalContentFinished = (
        <Alert severity="success">El documento se ha generado correctamente.</Alert>
    );

    const modalContentError = (
        <p>
            Se ha producido un error y no se han podido generar el documento.
            <br />
            {errorMessage ? <strong>{errorMessage}</strong> : null}
        </p>
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
            modalAcceptIcon={<PrintIcon />}
            spinnerMessage="Generando documento"
            modalErrorText={modalContentError}
        />
    ) : null;
};

export default PrintInvoicesModal;
