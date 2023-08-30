import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {MEMBER_TYPES} from "member/model";
import {MemberService} from "member/service";
import {ModalOperationStatus} from "base/ui/modal/config";
import {OperationWithConfirmationModal} from "base/ui/modal";
import Alert from "@mui/material/Alert";

const DeleteMemberModal = ({member, isOpen = false, onClose, onUpdateStatus}) => {
    const [operationStatus, setOperationStatus] = useState(ModalOperationStatus.START);

    const navigate = useNavigate();

    const closeModal = () => {
        onClose();
    };

    const onClickAccept = () => {
        deleteMember();
    };

    const onClickFinished = () => {
        closeModal();
        navigate("/socios");
    };

    const deleteMember = () => {
        setOperationStatus(ModalOperationStatus.PROGRESS);
        MemberService.updateMemberStatus(member.num_socio, {
            status: MEMBER_TYPES.DELETED.key,
        })
            .then(deletedMember => {
                onUpdateStatus(MEMBER_TYPES.DELETED.key);
                setOperationStatus(ModalOperationStatus.SUCCESS);
            })
            .catch(error => {
                console.log(error);
                setOperationStatus(ModalOperationStatus.ERROR);
            });
    };

    const modalContentStart = (
        <Alert severity="warning">
            ¿Desea eliminar a&nbsp;
            <strong>
                {member.num_socio} - {member.name}
            </strong>
            &nbsp; del sistema?
        </Alert>
    );

    const modalContentFinished = "Se ha eliminado al/a la socio/a del sistema.";

    return isOpen ? (
        <OperationWithConfirmationModal
            operationStatus={operationStatus}
            onClose={closeModal}
            onClickAccept={onClickAccept}
            onClickFinished={onClickFinished}
            modalTitle="Eliminar socio/a"
            modalContentStart={modalContentStart}
            modalContentFinished={modalContentFinished}
            modalErrorText="Se ha producido un error y no se ha podido eliminar el/la socio/a."
        />
    ) : null;
};

export default DeleteMemberModal;
