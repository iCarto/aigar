import {useNavigate} from "react-router-dom";

import {Modal} from "base/ui/modal/components";
import {BasicButton} from "base/ui/buttons/components";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const UpdatePaymentsModal = ({
    invoicingMonthId,
    invoicesLength,
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
    const modalBody = invoicesLength ? (
        <Alert severity="warning">
            <AlertTitle>Antes de continuar, asegúrese de haber:</AlertTitle>
            <ul>
                <li>Modificado los socios/as pertinentes</li>
                <li>Guardado una copia de seguridad</li>
            </ul>
        </Alert>
    ) : (
        <Alert severity="error">No se ha seleccionado ningún recibo.</Alert>
    );

    const modalFooter = invoicesLength ? (
        <>
            <BasicButton text="Cancelar" onClick={closeModal} variant="outlined" />
            <BasicButton text="Continuar" onClick={openLoadPaymentsWizard} />
        </>
    ) : null;

    return isOpen ? (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            header={modalHeader}
            body={modalBody}
            footer={modalFooter}
        />
    ) : null;
};

export default UpdatePaymentsModal;
