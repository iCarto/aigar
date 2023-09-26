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
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    //TO-DO: Check if this works for ListMonthlyInvoicesActions too
    const isDisabled = !!(
        invoices?.length > 0 && invoices?.every(invoice => invoice.consumo >= 0)
    );

    return (
        <>
            <Button
                onClick={handleOpenModal}
                disabled={isDisabled}
                variant="contained"
                startIcon={showIcon ? <PrintIcon fontSize="small" /> : null}
                title={
                    isDisabled
                        ? "No se pueden imprimir las facturas ya que alguna no tiene consumo registrado"
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
