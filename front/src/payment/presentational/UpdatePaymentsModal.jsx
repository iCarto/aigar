import {useNavigate} from "react-router-dom";

import {Modal} from "base/ui/modal/components";
import {BasicButton} from "base/ui/buttons/components";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export const UpdatePaymentsModal = ({
    invoicingMonthId,
    invoices,
    paymentType,
    isOpen = false,
    onClose,
}) => {
    const navigate = useNavigate();

    const closeModal = () => {
        onClose();
    };

    const textForHeader = paymentType === "ontime" ? "en plazo" : "con mora";
    const textForUrlSlug = paymentType === "ontime" ? "plazo" : "mora";

    const openLoadPaymentsWizard = () => {
        navigate(`/actualizarpagos/${invoicingMonthId}/manual_${textForUrlSlug}`);
    };

    const modalHeader = `Actualizar pagos del mes ${textForHeader}`;
    if (!isOpen) {
        return null;
    }
    if (!invoices?.length) {
        return (
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                header={modalHeader}
                body={
                    <Alert severity="error">No se ha seleccionado ningún recibo.</Alert>
                }
                footer={null}
            />
        );
    }
    const hasPayments = invoices.some(
        invoice => invoice.ontime_payment || invoice.late_payment
    );
    if (hasPayments) {
        return (
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                header={modalHeader}
                body={
                    <Alert severity="warning">
                        Ha seleccionado algún recibo que ya tiene pagos. Puede filtrar
                        los recibos por el estado "Pendiente de cobro" para actualizar
                        los pagos de los recibos pendientes.
                    </Alert>
                }
                footer={null}
            />
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            header={modalHeader}
            body={
                <Alert severity="warning">
                    <AlertTitle>Antes de continuar, asegúrese de haber:</AlertTitle>
                    <ul>
                        <li>Modificado los socios/as pertinentes</li>
                        <li>Guardado una copia de seguridad</li>
                    </ul>
                </Alert>
            }
            footer={
                <>
                    <BasicButton
                        text="Cancelar"
                        onClick={closeModal}
                        variant="outlined"
                    />
                    <BasicButton text="Continuar" onClick={openLoadPaymentsWizard} />
                </>
            }
        />
    );
};
