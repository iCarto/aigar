import {useState, useEffect} from "react";
import {InvoicingMonthService} from "monthlyinvoicing/service";
import {InvoicesListPreview} from "invoice/presentational";
import {Spinner} from "base/ui/other/components";
import Box from "@mui/material/Box";
import OperationWithConfirmationModal from "base/ui/modal/components/OperationWithConfirmationModal";
import {ModalOperationStatus} from "base/ui/modal/config";
import {
    reviewInvoices,
    reviewPayments,
    clearErrors,
} from "payment/data/paymentReviewUtils";
import {useInvoicesPreviewTableColumns} from "invoice/data";

const LoadPaymentsStep3InvoicesTable = ({
    payments,
    invoices,
    invoicingMonthId,
    onChangeInvoices,
    onValidateStep,
}) => {
    const [modalStatus, setModalStatus] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    useEffect(() => {
        if (!invoices.length) {
            onValidateStep(false);
        }
        InvoicingMonthService.previewInvoicesWithPayments(payments)
            .then(fetchedInvoices => {
                clearErrors(fetchedInvoices);
                reviewPayments(payments, fetchedInvoices);
                reviewInvoices(payments, fetchedInvoices);
                onChangeInvoices(fetchedInvoices);
                onValidateStep(true);
            })
            .catch(error => {
                console.log(error);
                onValidateStep(false);
            });
    }, [invoicingMonthId]);

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

    return (
        <Box display="flex" flexDirection="column" justifyContent="space-around">
            {invoices.length ? (
                <>
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

export default LoadPaymentsStep3InvoicesTable;
