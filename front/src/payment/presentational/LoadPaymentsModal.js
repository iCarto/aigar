import {useNavigate} from "react-router-dom";

import {Modal} from "base/ui/modal/components";
import {BasicButton} from "base/ui/buttons/components";
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
        <Alert severity="warning">
            <AlertTitle>Antes de continuar, asegúrese de haber:</AlertTitle>
            <ul>
                <li>Añadido socios/as nuevos/as</li>
                <li>Modificado los/as socios/as pertinentes</li>
                <li>Guardado una copia de seguridad</li>
            </ul>
        </Alert>
    );

    const modalFooter = (
        <>
            <BasicButton text="Cancelar" onClick={closeModal} variant="outlined" />
            <BasicButton text="Continuar" onClick={openLoadPaymentsWizard} />
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
