import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";

import {ListMemberInvoices, MemberPageSidebar} from "member/container";
import {MemberDetail} from "member/presentational";
import {Spinner} from "base/common";
import {ErrorMessage} from "base/error/components";
import {InvoiceService} from "invoice/service";
import {MemberService} from "member/service";
import {PageLayout} from "base/ui/page";
import Grid from "@mui/material/Grid";

const ViewMemberSubpage = () => {
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
                    <MemberPageSidebar
                        member={member}
                        numInvoices={invoices?.length || 0}
                    />
                ) : null
            }
        >
            <ErrorMessage message={error} />
            {isLoading ? <Spinner message="Cargando datos" /> : null}
            {member ? (
                <Grid item>
                    <MemberDetail member={member} />
                </Grid>
            ) : null}
            {invoices ? (
                <Grid item>
                    <ListMemberInvoices invoices={invoices} />
                </Grid>
            ) : null}
        </PageLayout>
    );
};

export default ViewMemberSubpage;
