import {useState, useEffect} from "react";
import {MemberService} from "member/service";
import {Modal} from "base/ui/modal/components";
import {Spinner} from "base/ui/other/components";
import {ErrorMessage} from "base/error/components";
import {ListMemberInvoices} from "member/container";
import {MemberDetail} from ".";

const MemberViewModal = ({id, isOpen, onClose}) => {
    const [member, setMember] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        loadMember();
    }, [id]);

    const loadMember = () => {
        if (id) {
            setIsLoading(true);
            MemberService.getMember(id)
                .then(member => {
                    setMember(member);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.log(error);
                    setErrorMessage(
                        "Se ha producido un error y no se han podido obtener los datos del socio/a"
                    );
                    setIsLoading(false);
                });
        }
    };

    const modalBody = isLoading ? (
        <Spinner message="Cargando datos" />
    ) : (
        <>
            <ErrorMessage message={errorMessage} />
            {member ? <MemberDetail member={member} /> : null}
            {member?.invoices ? (
                <ListMemberInvoices invoices={member.invoices} />
            ) : null}
        </>
    );

    return <Modal isOpen={isOpen} onClose={onClose} body={modalBody} />;
};

export default MemberViewModal;
