import {useState, useEffect} from "react";
import {ErrorSummary} from "../presentational";
import {InvoicingMonthService} from "monthlyinvoicing/service";
import {useFilterMonthlyData} from "monthlyinvoicing/hooks";
import {LoadDataTableFilter} from "loaddata/presentational";
import {InvoicesListPreview} from "invoice/presentational";
import {ErrorMessage} from "base/error/components";
import {Spinner} from "base/ui/other/components";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import OperationWithConfirmationModal from "base/ui/modal/components/OperationWithConfirmationModal";
import {ModalOperationStatus} from "base/ui/modal/config";
import {createAlertMessage} from "payment/model";

const LoadPaymentsStep3InvoicesTable = ({
    payments,
    invoices,
    invoicingMonthId,
    onChangeInvoices,
    onValidateStep,
}) => {
    const [filter, setFilter] = useState({
        text: "",
        showOnlyErrors: false,
    });

    const {filterMonthlyData} = useFilterMonthlyData();

    const [modalStatus, setModalStatus] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const filteredInvoices = invoices ? filterMonthlyData(invoices, filter) : [];

    useEffect(() => {
        if (!invoices.length) {
            onValidateStep(false);
        }
        InvoicingMonthService.previewInvoicesWithPayments(payments)
            .then(fetchedInvoices => {
                reviewInvoices(payments, fetchedInvoices);
                onChangeInvoices(fetchedInvoices);
                onValidateStep(true);
            })
            .catch(error => {
                console.log(error);
                onValidateStep(false);
            });
    }, [invoicingMonthId]);

    const reviewInvoices = (payments, invoices) => {
        invoices.forEach(invoice => {
            checkPaymentsForInvoice(payments, invoice);
        });
    };

    const checkPaymentsForInvoice = (payments, invoice) => {
        const paymentsForInvoice = payments.filter(
            payment => invoice.numero === payment.num_factura
        );

        if (!paymentsForInvoice.length) {
            invoice.errors.push(
                createAlertMessage(
                    "error",
                    "No se ha encontrado ningún pago para el recibo"
                )
            );
            return;
        }
        if (
            (invoice.ontime_payment && invoice.late_payment) ||
            (invoice.ontime_payment &&
                invoice.ontime_payment != paymentsForInvoice[0].monto) ||
            (invoice.late_payment &&
                invoice.late_payment != paymentsForInvoice[0].monto) ||
            paymentsForInvoice.length > 1
        ) {
            invoice.errors.push(
                createAlertMessage("error", "El recibo tiene varios pagos")
            );
            return;
        }

        if (invoice.consumo > 30) {
            invoice.errors.push(
                createAlertMessage(
                    "warning",
                    "El consumo es superior a 30m3. Revise si se debería usar una tarifa de uso comercial"
                )
            );
        }
        if (invoice.total > invoice.ontime_payment + invoice.late_payment) {
            invoice.errors.push(
                createAlertMessage("warning", "El pago no cubre el total")
            );
        }
        if (invoice.total < invoice.ontime_payment + invoice.late_payment) {
            invoice.errors.push(
                createAlertMessage("warning", "El pago supera el total")
            );
        }
    };

    const handleFilterChange = newFilter => {
        setFilter(prevFilter => ({
            ...prevFilter,
            ...newFilter,
        }));
    };

    const getTotalErrors = items => {
        return items.filter(
            item => item.errors.length !== 0 && item.errors[0].type === "error"
        ).length;
    };

    const getTotalWarnings = items => {
        return items.filter(
            item => item.errors.length !== 0 && item.errors[0].type === "warning"
        ).length;
    };

    const totalInvoicesWithErrors = getTotalErrors(invoices);
    const totalInvoicesWithWarnings = getTotalWarnings(invoices);

    if (totalInvoicesWithErrors >= invoices.length) {
        onValidateStep(false);
        return (
            <ErrorSummary
                totalErrors={totalInvoicesWithErrors}
                totalPayments={invoices.length}
                message="Todos los registros tienen errores. Compruebe que ha cargado el fichero correcto y vuelva a empezar."
            />
        );
    }

    let errorsMessage = null;
    if (totalInvoicesWithErrors) {
        onValidateStep(false);
        errorsMessage = (
            <Typography>
                Existen <strong>{totalInvoicesWithErrors}</strong> recibos con errores
                que debe revisar antes de poder continuar.
            </Typography>
        );
    } else {
        onValidateStep(true);
    }

    let warningsMessage = null;
    if (totalInvoicesWithWarnings) {
        warningsMessage = (
            <Typography>
                Existen <strong>{totalInvoicesWithWarnings}</strong> recibos con alertas
                que debería revisar.
            </Typography>
        );
    }
    let alertsMessage = null;
    if (errorsMessage || warningsMessage) {
        alertsMessage = (
            <>
                {errorsMessage}
                <br />
                {warningsMessage}
            </>
        );
    }

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
                    <ErrorMessage message={alertsMessage} />

                    <LoadDataTableFilter
                        filter={filter}
                        onChange={handleFilterChange}
                    />
                    <InvoicesListPreview
                        invoices={filteredInvoices}
                        invoicesTableType="payments"
                        removeRow={removeRow}
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
