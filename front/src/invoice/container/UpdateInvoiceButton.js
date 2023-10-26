import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {ESTADOS_FACTURA} from "invoice/model";
import {EditButton} from "base/ui/buttons/components";
import {UpdateInvoiceModal} from ".";

const UpdateInvoiceButton = ({invoice}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    const handleClick = () => {
        if (invoice.estado === ESTADOS_FACTURA.NUEVA) {
            navigate(`/facturas/${invoice.id}/modificar`);
        } else {
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return invoice.is_active ? (
        <>
            <EditButton
                onClick={handleClick}
                text={
                    invoice.estado === ESTADOS_FACTURA.NUEVA
                        ? "Modificar"
                        : "Nueva versión"
                }
            />
            <UpdateInvoiceModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                invoice={invoice}
            />
        </>
    ) : null;
};

export default UpdateInvoiceButton;
