import {useState} from "react";
import {useLocation} from "react-router-dom";
import {MemberService} from "member/service";
import {ModalOperationStatus} from "base/ui/modal/config";
import {useNavigateWithReload} from "base/navigation/hooks";
import {OperationWithConfirmationModal} from "base/ui/modal";
import Alert from "@mui/material/Alert";
import FormatColorResetIcon from "@mui/icons-material/FormatColorReset";
import AlertTitle from "@mui/material/AlertTitle";

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
        <Alert severity="warning" sx={{marginTop: 2}}>
            <AlertTitle>
                ¿Desea desconectar el socio&nbsp;
                <strong>
                    {member.num_socio} - {member.name}
                </strong>
                ?
            </AlertTitle>
            Para este socio se seguirán creando facturas mensuales para mantener
            actualizado el costo del servicio cuando vuelva a ser conectado.
        </Alert>
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
            modalAcceptIcon={<FormatColorResetIcon />}
            modalErrorText="Se ha producido un error y no se ha podido desconectar el socio."
        />
    ) : null;
};

export default DisconnectMemberButton;
