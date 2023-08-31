import {useState} from "react";
import {MemberService} from "member/service";
import {OperationWithConfirmationModal} from "base/ui/modal";
import {ModalOperationStatus} from "base/ui/modal/config";
import {useNavigateWithReload} from "base/navigation/hooks";
import {useLocation} from "react-router-dom";
import Alert from "@mui/material/Alert";
import WaterDropIcon from "@mui/icons-material/WaterDrop";

const ConnectMemberModal = ({isOpen = false, onClose, member}) => {
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
        console.log("ConnectMemberModal.disconnectMember");
        setOperationStatus(ModalOperationStatus.PROGRESS);
        MemberService.setMemberConnected(member, false)
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
            ¿Desea volver a conectar al socio&nbsp;
            <strong>
                {member.num_socio} - {member.name}
            </strong>
            ?
        </p>
    );

    const modalContentFinished = (
        <Alert severity="success">El socio ha sido reconectado del sistema.</Alert>
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
            modalErrorText="Se ha producido un error y no se ha podido conectar el socio."
        />
    ) : null;
};

export default ConnectMemberModal;
