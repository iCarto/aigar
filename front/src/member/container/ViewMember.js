import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";

import {ListMemberInvoices} from "member/container";
import {MemberDetail} from "member/presentational";
import ViewMemberSidebar from "./ViewMemberSidebar";
import {Spinner} from "base/common";
import {ErrorMessage} from "base/error/components";
import {InvoiceService} from "invoice/service";
import {MemberService} from "member/service";
import {PageLayout} from "base/ui/page";

const ViewMember = () => {
    const [member, setMember] = useState(null);
    const [invoices, setInvoices] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [error, setError] = useState("");

    const {num_socio} = useParams();

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

    return (
        <PageLayout
            sidebar={
                member ? (
                    <ViewMemberSidebar
                        member={member}
                        numInvoices={invoices?.length || 0}
                    />
                ) : null
            }
        >
            <ErrorMessage message={error} />
            {isLoading ? <Spinner message="Cargando datos" /> : null}
            {member ? <MemberDetail member={member} /> : null}
            {invoices ? <ListMemberInvoices invoices={invoices} /> : null}
        </PageLayout>
    );
};

export default ViewMember;
