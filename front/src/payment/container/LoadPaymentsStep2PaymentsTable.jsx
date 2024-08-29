import {PaymentTable} from "../presentational";

import {Spinner} from "base/ui/other/components";
import {useEffect, useState} from "react";

import Box from "@mui/material/Box";
import OperationWithConfirmationModal from "base/ui/modal/components/OperationWithConfirmationModal";
import {ModalOperationStatus} from "base/ui/modal/config";

import {InvoicingMonthService} from "monthlyinvoicing/service";
import {createPayment} from "payment/model";
import {usePaymentData} from "payment/hooks";

const LoadPaymentsStep2PaymentsTable = ({
    invoicingMonthId,
    onValidateStep,
    payments,
    onChangePayments,
}) => {
    const [invoices, setInvoices] = useState([]);

    const [modalStatus, setModalStatus] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    const {reviewPayments} = usePaymentData(onChangePayments, onValidateStep);

    useEffect(() => {
        InvoicingMonthService.getInvoicingMonthInvoices(invoicingMonthId)
            .then(fetchedInvoices => {
                setInvoices(fetchedInvoices);
                reviewPayments(payments, fetchedInvoices);
            })
            .catch(error => {
                console.log(error);
                onValidateStep(false);
            });
    }, [invoicingMonthId]);

    const removeRow = item => {
        setSelectedItem(item);
        setModalStatus(ModalOperationStatus.START);
    };

    const handleConfirmRemove = () => {
        setModalStatus(ModalOperationStatus.PROGRESS);
        const updatedItems = payments.filter(item => item.id !== selectedItem.id);
        // onChangePayments(updatedItems);
        reviewPayments(updatedItems, invoices);
        setModalStatus(ModalOperationStatus.SUCCESS);
    };

    const handleCloseModal = () => {
        setModalStatus(null);
        setSelectedItem(null);
    };

    const handleUpdatePayment = (row, columnId, value) => {
        const updatedPayments = payments.map(payment => {
            if (payment.id === row.original.id) {
                return createPayment({...payment, [columnId]: value});
            }
            return payment;
        });
        reviewPayments(updatedPayments, invoices);
    };

    return (
        <Box display="flex" flexDirection="column" justifyContent="space-around">
            {payments.length ? (
                <>
                    <PaymentTable
                        payments={payments}
                        invoicingMonthId={invoicingMonthId}
                        onChangePayments={onChangePayments}
                        onValidateStep={onValidateStep}
                        removeRow={removeRow}
                        onUpdateData={handleUpdatePayment}
                    />

                    <OperationWithConfirmationModal
                        operationStatus={modalStatus}
                        modalTitle="Eliminar pago"
                        modalContentStart={`¿Está seguro que desea eliminar el pago ${selectedItem?.num_factura}?`}
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
                <Spinner message="Cargando pagos" />
            )}
        </Box>
    );
};

export default LoadPaymentsStep2PaymentsTable;
