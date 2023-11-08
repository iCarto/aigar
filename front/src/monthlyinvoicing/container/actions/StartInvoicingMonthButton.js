import {useState} from "react";
import {StartInvoicingMonthModal} from ".";
import Button from "@mui/material/Button";

const StartInvoicingMonthButton = ({invoicingMonth, disabled}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button
                onClick={handleClick}
                variant="contained"
                disabled={disabled}
                fullWidth
            >
                1. Iniciar proceso
            </Button>
            <StartInvoicingMonthModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                invoicingMonth={invoicingMonth}
            />
        </>
    );
};

export default StartInvoicingMonthButton;
