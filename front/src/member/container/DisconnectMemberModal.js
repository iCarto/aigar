import {useState} from "react";
import {useLocation} from "react-router-dom";
import {MemberService} from "member/service";
import {MEMBER_TYPES} from "member/model";
import {ModalOperationStatus} from "base/ui/modal/config";
import {useNavigateWithReload} from "base/navigation/hooks";
import {OperationWithConfirmationModal} from "base/ui/modal";
import Alert from "@mui/material/Alert";
import FormatColorResetIcon from "@mui/icons-material/FormatColorReset";
import AlertTitle from "@mui/material/AlertTitle";

const DisconnectMemberModal = ({member, isOpen = false, onClose, onUpdateStatus}) => {
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
        setOperationStatus(ModalOperationStatus.PROGRESS);
        MemberService.updateMemberStatus(member.num_socio, {
            status: MEMBER_TYPES.INACTIVE.key,
        })
            .then(disconnectedMember => {
                onUpdateStatus(MEMBER_TYPES.INACTIVE.key);
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
                ¿Desea desactivar a&nbsp;
                <strong>
                    {member.num_socio} - {member.name}
                </strong>
                ?
            </AlertTitle>
            Ya no se seguirán creando facturas mensuales para este/a socio/a.
        </Alert>
    );

    const modalContentFinished = "Se ha desactivado al socio/a la socia del sistema.";

    return isOpen ? (
        <OperationWithConfirmationModal
            operationStatus={operationStatus}
            onClose={closeModal}
            onClickAccept={onClickAccept}
            onClickFinished={onClickFinished}
            modalTitle="Desactivar socio/a"
            modalContentStart={modalContentStart}
            modalContentFinished={modalContentFinished}
            modalAcceptText="Desconectar"
            modalAcceptIcon={<FormatColorResetIcon />}
            modalErrorText="Se ha producido un error y no se ha podido desconectar a la socia."
        />
    ) : null;
};

export default DisconnectMemberModal;
