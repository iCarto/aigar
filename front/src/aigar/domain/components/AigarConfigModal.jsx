import {useEffect, useState} from "react";
import {useDomain} from "aigar/domain/provider";
import {Modal} from "base/ui/modal/components";
import {ErrorMessage} from "base/error/components";
import {ButtonLink} from "base/navigation/components";
import {Spinner} from "base/ui/other/components";

const AigarConfigModal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {aigarConfig} = useDomain();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            setIsModalOpen(!aigarConfig);
        }, 2000);

        return () => {
            clearTimeout(timer);
        };
    }, [aigarConfig]);

    const handleCloseModal = () => {
        return;
    };
    const adminPanelUrl = "/gestion/";

    const modalHeader = isLoading
        ? null
        : "No se ha configurado el nombre de su Junta de Agua";

    const modalBody = isLoading ? (
        <Spinner message="Cargando datos" />
    ) : (
        <ErrorMessage message="Vaya al panel de gestión para configurar los datos de su Junta de Agua." />
    );

    const modalFooter = isLoading ? null : (
        <ButtonLink
            to={adminPanelUrl}
            text="Ir al panel de gestión"
            fullWidth={false}
            openNewTab
        />
    );

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            header={modalHeader}
            body={modalBody}
            footer={modalFooter}
        />
    );
};

export default AigarConfigModal;
