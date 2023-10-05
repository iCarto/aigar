import {useState} from "react";
import {LoadPaymentsModal} from "payment/presentational";
import Button from "@mui/material/Button";

const LoadPaymentsButton = ({invoicingMonth, disabled = false}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button
                onClick={handleOpenModal}
                disabled={disabled}
                variant="contained"
                fullWidth
            >
                5. Actualizar pagos
            </Button>
            <LoadPaymentsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                invoicingMonthId={invoicingMonth.id_mes_facturacion}
            />
        </>
    );
};

export default LoadPaymentsButton;
