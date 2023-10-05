import {useState} from "react";
import {PrintInvoicesModal} from "invoice/container";
import Button from "@mui/material/Button";
import PrintIcon from "@mui/icons-material/Print";

const PrintInvoicesButton = ({
    invoices,
    onDataUpdate = null,
    outputFilename,
    showIcon = true,
    buttonTitle = "",
    disabled = false,
}) => {
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
                startIcon={showIcon ? <PrintIcon fontSize="small" /> : null}
                title={
                    disabled
                        ? "No se pueden imprimir las facturas ya que alguna no tiene el caudal actual registrado"
                        : null
                }
                fullWidth
            >
                {buttonTitle || "Imprimir"}
            </Button>
            <PrintInvoicesModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onDataUpdate={onDataUpdate}
                invoices={invoices}
                outputFilename={outputFilename}
            />
        </>
    );
};

export default PrintInvoicesButton;
