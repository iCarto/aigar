import {useState} from "react";
import {useLocation} from "react-router-dom";
import {MemberService} from "member/service";
import {ModalOperationStatus} from "base/ui/modal/config";
import {useNavigateWithReload} from "base/navigation/hooks";
import {OperationWithConfirmationModal} from "base/ui/modal";

const DisconnectMemberButton = ({isOpen = false, onClose, member}) => {
    const [operationStatus, setOperationStatus] = useState(ModalOperationStatus.START);

    const navigate = useNavigateWithReload();
    const location = useLocation();
    const basePath = location.pathname;

    const closeModal = () => {
        onClose();
    };

    const onClickAccept = () => {
        disconnectMember();
    };

    const onClickFinished = () => {
        closeModal();
        navigate(basePath, true);
    };

    const disconnectMember = () => {
        console.log("DisconnectMemberButton.disconnectMember");
        setOperationStatus(ModalOperationStatus.PROGRESS);
        MemberService.setMemberConnected(member, true)
            .then(disconnectedMember => {
                setOperationStatus(ModalOperationStatus.SUCCESS);
            })
            .catch(error => {
                console.log(error);
                setOperationStatus(ModalOperationStatus.ERROR);
            });
    };

    const modalContentStart = (
        <p>
            ¿Desea desconectar el socio&nbsp;
            <strong>
                {member.num_socio} - {member.name}
            </strong>
            ?
            <br />
            Para este socio se seguirán creando facturas mensuales para mantener
            actualizado el costo del servicio cuando vuelva a ser conectado.
        </p>
    );

    const modalContentFinished = "El socio ha sido desconectado del sistema.";

    return isOpen ? (
        <OperationWithConfirmationModal
            operationStatus={operationStatus}
            onClose={closeModal}
            onClickAccept={onClickAccept}
            onClickFinished={onClickFinished}
            modalTitle="Desconectar socio/a"
            modalContentStart={modalContentStart}
            modalContentFinished={modalContentFinished}
            modalAcceptText="Desconectar"
            modalAcceptIcon="tint-slash"
            modalErrorText="Se ha producido un error y no se ha podido desconectar el socio."
        />
    ) : null;
};

export default DisconnectMemberButton;
