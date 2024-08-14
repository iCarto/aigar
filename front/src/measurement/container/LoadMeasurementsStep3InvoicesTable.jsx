import {useEffect, useState} from "react";
import {InvoicingMonthService} from "monthlyinvoicing/service";
import {InvoicesListPreview} from "invoice/presentational";
import {Spinner} from "base/ui/other/components";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {reviewMeasurements, reviewMeasurementsWithoutInvoice} from "measurement/data";
import {ModalOperationStatus} from "base/ui/modal/config";
import OperationWithConfirmationModal from "base/ui/modal/components/OperationWithConfirmationModal";
import {useInvoicesPreviewTableColumns} from "invoice/data";
import {ErrorMessage} from "base/error/components";

export const LoadMeasurementsStep3InvoicesTable = ({
    measurements,
    invoices,
    invoicingMonthId,
    onChangeInvoices,
    onValidateStep,
}) => {
    const [modalStatus, setModalStatus] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const [measurementsWithoutInvoice, setMeasurementsWithoutInvoice] = useState([]);

    useEffect(() => {
        onValidateStep(false);
        InvoicingMonthService.previewInvoicesWithMeasurements(measurements)
            .then(fetchedInvoices => {
                setMeasurementsWithoutInvoice(
                    reviewMeasurementsWithoutInvoice(measurements, fetchedInvoices)
                );
                reviewMeasurements(measurements, fetchedInvoices);
                onChangeInvoices(fetchedInvoices);
                onValidateStep(true);
            })
            .catch(error => {
                console.log(error);
                onValidateStep(false);
            });
    }, [invoicingMonthId, measurements]);

    const removeRow = invoice => {
        setSelectedInvoice(invoice);
        setModalStatus(ModalOperationStatus.START);
    };

    const handleConfirmRemove = () => {
        setModalStatus(ModalOperationStatus.PROGRESS);
        const updatedInvoices = invoices.filter(
            inv => inv.numero !== selectedInvoice.numero
        );
        onChangeInvoices(updatedInvoices);
        setModalStatus(ModalOperationStatus.SUCCESS);
    };

    const handleCloseModal = () => {
        setModalStatus(null);
        setSelectedInvoice(null);
    };

    const measurementsWithoutInvoiceMessage = (
        <Typography fontWeight={700}>
            Se han detectado lecturas para socios/as que no tienen recibo:{" "}
            {measurementsWithoutInvoice.join(", ")}
        </Typography>
    );

    return (
        <Box display="flex" flexDirection="column" justifyContent="space-around">
            {invoices.length ? (
                <>
                    {measurementsWithoutInvoice.length ? (
                        <ErrorMessage
                            message={measurementsWithoutInvoiceMessage}
                            severity="warning"
                        />
                    ) : null}
                    <InvoicesListPreview
                        invoices={invoices}
                        invoicesTableType="payments"
                        useTableColumnsHook={useInvoicesPreviewTableColumns}
                        onValidateStep={onValidateStep}
                        removeRow={removeRow}
                        onUpdateData={null}
                    />
                    <OperationWithConfirmationModal
                        operationStatus={modalStatus}
                        modalTitle="Eliminar pago"
                        modalContentStart={`¿Está seguro que desea eliminar el pago del recibo ${selectedInvoice?.numero}?`}
                        modalContentFinished="El pago ha sido eliminado correctamente."
                        modalAcceptText="Eliminar"
                        spinnerMessage="Eliminando pago..."
                        modalErrorText="Ha ocurrido un error al eliminar el pago."
                        onClose={handleCloseModal}
                        onClickAccept={handleConfirmRemove}
                        onClickFinished={handleCloseModal}
                    />
                </>
            ) : (
                <Spinner message="Cargando recibos" />
            )}
        </Box>
    );
};
