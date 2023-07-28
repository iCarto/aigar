import {useState, useEffect} from "react";
import {Modal} from "base/ui/modal";
import {MemberService} from "member/service";
import {Spinner} from "base/common";
import {ErrorMessage} from "base/error/components";
import {ListMemberInvoices} from "member/container";
import {MemberDetail} from ".";

const MemberViewModal = ({num_socio, isOpen, onClose}) => {
    const [member, setMember] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        loadMember();
    }, [num_socio]);

    const loadMember = () => {
        if (num_socio) {
            setIsLoading(true);
            MemberService.getMember(num_socio)
                .then(member => {
                    setMember(member);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.log(error);
                    setErrorMessage(
                        "Se ha producido un error y no se han podido obtener los datos del socio"
                    );
                    setIsLoading(false);
                });
        }
    };

    const modalHeader = "Detalle del/de la socio/a";
    const modalBody = isLoading ? (
        <Spinner message="Cargando datos" />
    ) : (
        <>
            <ErrorMessage message={errorMessage} />
            <MemberDetail member={member} />
            {member ? <ListMemberInvoices invoices={member.invoices} /> : null}
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            header={modalHeader}
            body={modalBody}
        />
    );
};

export default MemberViewModal;
