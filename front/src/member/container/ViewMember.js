import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {ListMemberInvoices} from "member/container";
import {MemberDetail} from "member/presentational";
import ViewMemberSidebar from "./ViewMemberSidebar";
import {Spinner} from "base/common";
import {ErrorMessage} from "base/error/components";
import {InvoiceService} from "invoice/service";
import {MemberService} from "member/service";
import {PageContainer} from "base/ui/page";

const ViewMember = () => {
    const [member, setMember] = useState(null);
    const [invoices, setInvoices] = useState(null);
    const [view, setView] = useState("view");
    const [isLoading, setIsLoading] = useState(null);
    const [error, setError] = useState("");

    const {num_socio} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);

        Promise.all([
            MemberService.getMember(num_socio),
            InvoiceService.getInvoicesForMember(num_socio),
        ])
            .then(result => {
                const member = result[0];
                setMember(member);
                setInvoices(result[1]);
                if (!member.is_active) setError("El socio ha sido borrado.");
            })
            .catch(error => {
                console.log(error);
                setError(
                    "Se ha producido un error y no se han podido obtener los datos del socio"
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [num_socio]);

    const handleBack = () => {
        console.log("ViewInvoice.handleBack");
        navigate(-1);
    };

    const handleSuccessConnectMember = () => {
        setView("view");
    };

    const handleSuccessDisconnectMember = () => {
        setView("view");
    };

    const handleSuccessDeletedMember = () => {
        handleBack();
    };

    return (
        <>
            <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                {member ? (
                    <ViewMemberSidebar
                        member={member}
                        numInvoices={invoices?.length || 0}
                        handleSuccessDeletedMember={handleSuccessDeletedMember}
                        handleSuccessConnectMember={handleSuccessConnectMember}
                        handleSuccessDisconnectMember={handleSuccessDisconnectMember}
                    />
                ) : null}
            </nav>
            <PageContainer isSubpage>
                <ErrorMessage message={error} />
                {isLoading ? <Spinner message="Cargando datos" /> : null}
                {member ? <MemberDetail member={member} /> : null}
                {invoices ? <ListMemberInvoices invoices={invoices} /> : null}
            </PageContainer>
        </>
    );
};

export default ViewMember;
