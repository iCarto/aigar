import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {ESTADOS_FACTURA} from "invoice/model";
import {UpdateInvoiceModal} from ".";
import {EditButton} from "base/common";

const UpdateInvoiceButton = ({invoice}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    const handleClick = () => {
        if (invoice.estado === ESTADOS_FACTURA.NUEVA) {
            navigate("modificar");
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
                disabled={invoice.estado !== ESTADOS_FACTURA.NUEVA}
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
