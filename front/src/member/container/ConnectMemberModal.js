import {useState} from "react";
import {useLocation} from "react-router-dom";
import {MemberService} from "member/service";
import {MEMBER_TYPES} from "member/config";
import {ModalOperationStatus} from "base/ui/modal/config";
import {useNavigateWithReload} from "base/navigation/hooks";
import {OperationWithConfirmationModal} from "base/ui/modal";
import Alert from "@mui/material/Alert";
import WaterDropIcon from "@mui/icons-material/WaterDrop";

const ConnectMemberModal = ({member, isOpen = false, onClose, onUpdateStatus}) => {
    const [operationStatus, setOperationStatus] = useState(ModalOperationStatus.START);

    const navigate = useNavigateWithReload();
    const location = useLocation();
    const basePath = location.pathname;

    const closeModal = () => {
        onClose();
    };

    const onClickAccept = () => {
        connectMember();
    };

    const onClickFinished = () => {
        closeModal();
        navigate(basePath, true);
    };

    const connectMember = () => {
        setOperationStatus(ModalOperationStatus.PROGRESS);
        MemberService.updateMemberStatus(member.num_socio, MEMBER_TYPES.ACTIVE.key)
            .then(connectedMember => {
                onUpdateStatus(MEMBER_TYPES.ACTIVE.key);
                setOperationStatus(ModalOperationStatus.SUCCESS);
            })
            .catch(error => {
                console.log(error);
                setOperationStatus(ModalOperationStatus.ERROR);
            });
    };

    const modalContentStart = (
        <p>
            ¿Desea volver a conectar a&nbsp;
            <strong>
                {member.num_socio} - {member.name}
            </strong>
            &nbsp;en el sistema?
        </p>
    );

    const modalContentFinished = (
        <Alert severity="success">El socio/a ha sido reconectado del sistema.</Alert>
    );

    return isOpen ? (
        <OperationWithConfirmationModal
            operationStatus={operationStatus}
            onClose={closeModal}
            onClickAccept={onClickAccept}
            onClickFinished={onClickFinished}
            modalTitle="Volver a conectar socio/a"
            modalContentStart={modalContentStart}
            modalContentFinished={modalContentFinished}
            modalAcceptText="Conectar"
            modalAcceptIcon={<WaterDropIcon />}
            modalErrorText="Se ha producido un error y no se ha podido conectar a la socia."
        />
    ) : null;
};

export default ConnectMemberModal;
