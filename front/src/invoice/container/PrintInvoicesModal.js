import {useState} from "react";
import {DocXPrintFileService, FileService} from "base/file/service";
import {InvoiceService} from "invoice/service";
import {ESTADOS_FACTURA} from "invoice/model";
import {useDomain} from "aigar/domain/provider";
import {ModalOperationStatus} from "base/ui/modal/config";
import {useGetSectorReadingDay} from "aigar/domain/hooks";
import {DateUtil, NumberUtil} from "base/format/utilities";
import {Modal, OperationWithConfirmationModal} from "base/ui/modal/components";
import Alert from "@mui/material/Alert";
import PrintIcon from "@mui/icons-material/Print";
import AlertTitle from "@mui/material/AlertTitle";

const PrintInvoicesModal = ({
    invoices,
    isOpen = false,
    onDataUpdate = null,
    onClose,
    outputFilename,
}) => {
    const [operationStatus, setOperationStatus] = useState(ModalOperationStatus.START);
    const [errorMessage, setErrorMessage] = useState(null);

    const {aigarConfig, sectorsLong} = useDomain();

    // Basic config is always a list with one single object
    const communityName = aigarConfig?.name;
    const paymentMethod = aigarConfig?.payment_method;

    const getReadingDay = useGetSectorReadingDay;

    const formatedInvoices = invoices.map(invoice => {
        const readingDay = getReadingDay(invoice.sector);

        let descuento = NumberUtil.formatCurrency(invoice.descuento, false);
        if (invoice.descuento) {
            descuento = `- ${descuento}`;
        }
        return {
            ...invoice,
            nombre_junta: communityName,
            payment_method: paymentMethod,
            comunidad: sectorsLong[invoice.sector]?.long_name,
            fecha_lectura: invoice.readingDay(readingDay),
            due_date: DateUtil.toLocal(invoice.due_date),
            mes: DateUtil.getMonthName(invoice.mes),
            cuota_fija: NumberUtil.formatCurrency(invoice.cuota_fija, false),
            cuota_variable: NumberUtil.formatCurrency(invoice.cuota_variable, false),
            comision: NumberUtil.formatCurrency(invoice.comision, false),
            ahorro: NumberUtil.formatCurrency(invoice.ahorro, false),
            derecho: NumberUtil.formatCurrency(invoice.derecho, false),
            mora: NumberUtil.formatCurrency(invoice.mora, false),
            asamblea: NumberUtil.formatCurrency(invoice.asamblea, false),
            jornada_trabajo: NumberUtil.formatCurrency(invoice.jornada_trabajo, false),
            reconexion: NumberUtil.formatCurrency(invoice.reconexion, false),
            traspaso: NumberUtil.formatCurrency(invoice.traspaso, false),
            otros: NumberUtil.formatCurrency(invoice.otros, false),
            saldo_pendiente: NumberUtil.formatCurrency(invoice.saldo_pendiente, false),
            descuento: descuento,
            total: NumberUtil.formatCurrency(invoice.total, false),
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

            if (!invoiceIdsToUpdate.length) {
                setOperationStatus(ModalOperationStatus.SUCCESS);
                setErrorMessage(null);
                if (onDataUpdate) onDataUpdate();
                return;
            }

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
                    setErrorMessage("No se ha podido actualizar el estado del recibo.");
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

    const modalHeader = "Imprimir recibos";

    const modalContentStart = (
        <Alert severity="warning" sx={{marginTop: 2}}>
            <AlertTitle>
                A continuación procederá a imprimir{" "}
                {invoices && invoices.length === 1
                    ? "el recibo seleccionado"
                    : `los recibos seleccionados (${invoices.length})`}
                .
            </AlertTitle>
            ¿Ha revisado previamente si es necesario añadir otros importes, como
            penalizaciones, nuevos derechos, reconexiones, traspasos...?
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
        invoices.length ? (
            <OperationWithConfirmationModal
                operationStatus={operationStatus}
                onClose={handleClose}
                onClickAccept={handleClickAccept}
                onClickFinished={handleClickFinished}
                modalTitle={modalHeader}
                modalContentStart={modalContentStart}
                modalContentFinished={modalContentFinished}
                modalAcceptText="Imprimir"
                modalAcceptIcon={<PrintIcon />}
                spinnerMessage="Generando documento"
                modalErrorText={modalContentError}
            />
        ) : (
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                header={modalHeader}
                body={
                    <Alert severity="error">No se ha seleccionado ningún recibo.</Alert>
                }
            />
        )
    ) : null;
};

export default PrintInvoicesModal;
