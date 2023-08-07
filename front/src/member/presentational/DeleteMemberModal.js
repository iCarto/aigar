import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {MemberService} from "member/service";
import {ModalOperationStatus} from "base/ui/modal/config";
import {OperationWithConfirmationModal} from "base/ui/modal";

const DeleteMemberModal = ({isOpen = false, onClose, member}) => {
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
        console.log("DeleteMemberButton.deleteMember");
        setOperationStatus(ModalOperationStatus.PROGRESS);
        MemberService.deleteMember(member)
            .then(deletedMember => {
                setOperationStatus(ModalOperationStatus.SUCCESS);
            })
            .catch(error => {
                console.log(error);
                setOperationStatus(ModalOperationStatus.ERROR);
            });
    };

    const modalContentStart = (
        <p>
            Desea eliminar el/la socio/a&nbsp;
            <strong>
                {member.num_socio} - {member.name}
            </strong>
        </p>
    );

    const modalContentFinished = "El socio ha sido eliminado del sistema.";

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
