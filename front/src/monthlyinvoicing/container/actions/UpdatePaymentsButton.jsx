import {useState} from "react";
import {UpdatePaymentsModal} from "payment/presentational";
import {DropdownButton} from "base/ui/buttons/components";

export const UpdatePaymentsButton = ({
    invoicingMonthId,
    invoices,
    disabled = false,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paymentType, setPaymentType] = useState("ontime");

    const handleOpenOntimePyamentsModal = () => {
        setPaymentType("ontime");
        setIsModalOpen(true);
    };

    const handleOpenLateaymentsModal = () => {
        setPaymentType("late");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const dropDownButtonActions = [
        {text: "Pagos en plazo", onClick: handleOpenOntimePyamentsModal},
        {text: "Pagos con mora", onClick: handleOpenLateaymentsModal},
    ];

    return (
        <>
            <DropdownButton
                text="5. Actualizar pagos"
                actions={dropDownButtonActions}
                disabled={disabled}
            />

            <UpdatePaymentsModal
                invoicingMonthId={invoicingMonthId}
                invoices={invoices}
                paymentType={paymentType}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
};
