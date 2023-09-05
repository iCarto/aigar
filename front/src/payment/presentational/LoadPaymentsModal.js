import {useNavigate} from "react-router-dom";

import {Modal} from "base/ui/modal";
import {ContinueButton, CancelButton} from "base/common";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const LoadPaymentsModal = ({isOpen = false, onClose, invoicingMonthId}) => {
    const navigate = useNavigate();

    const closeModal = () => {
        onClose();
    };

    const openLoadPaymentsWizard = () => {
        navigate(`/cargarpagos/${invoicingMonthId}`);
    };

    const modalHeader = "Importar pagos del mes";
    const modalBody = (
        <>
            <Alert severity="warning">
                <AlertTitle>Antes de continuar, asegúrese de haber:</AlertTitle>
                <ul>
                    <li>Añadido socios/as nuevos/as</li>
                    <li>Modificado los/as socios/as pertinentes</li>
                    <li>Guardado una copia de seguridad</li>
                </ul>
            </Alert>
        </>
    );

    const modalFooter = (
        <>
            <CancelButton onClick={closeModal} />
            <ContinueButton onClick={openLoadPaymentsWizard} />
        </>
    );

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

export default LoadPaymentsModal;