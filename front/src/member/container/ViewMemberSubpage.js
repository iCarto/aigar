import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";

import {InvoiceService} from "invoice/service";
import {MemberService} from "member/service";
import {PageLayout} from "base/ui/page";
import {SectionHeading} from "base/ui/section/components";
import {Spinner} from "base/ui/other/components";
import {ErrorMessage} from "base/error/components";
import {ListMemberInvoices, MemberPageSidebar} from "member/container";
import {MemberDetail} from "member/presentational";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";

const ViewMemberSubpage = () => {
    const [member, setMember] = useState(null);
    const [memberStatus, setMemberStatus] = useState("");
    const [invoices, setInvoices] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [error, setError] = useState("");

    const {member_id} = useParams();

    useEffect(() => {
        setIsLoading(true);

        Promise.all([
            MemberService.getMember(member_id),
            InvoiceService.getInvoicesForMember(member_id),
        ])
            .then(result => {
                const member = result[0];
                setMember(member);
                setInvoices(result[1]);
            })
            .catch(error => {
                console.log(error);
                setError(
                    "Se ha producido un error y no se han podido obtener los datos del socio/a"
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [member_id, memberStatus]);

    const handleStatusUpdate = newStatus => {
        setMemberStatus(newStatus);
    };

    return (
        <PageLayout
            sidebar={
                member ? (
                    <MemberPageSidebar
                        member={member}
                        onUpdateStatus={handleStatusUpdate}
                    />
                ) : null
            }
        >
            {isLoading ? (
                <Spinner message="Cargando datos" />
            ) : (
                <>
                    <ErrorMessage message={error} />
                    {member ? (
                        <>
                            <Grid item>
                                <MemberDetail member={member} />
                            </Grid>
                            <Grid item>
                                <SectionHeading
                                    containerStyle={{justifyContent: "center", my: 1}}
                                    label={false}
                                >
                                    Facturas
                                </SectionHeading>
                                {invoices?.length ? (
                                    <ListMemberInvoices invoices={invoices} />
                                ) : (
                                    <Alert severity="info">
                                        Aún no se ha emitido ninguna factura para este
                                        socio/a.
                                    </Alert>
                                )}
                            </Grid>
                        </>
                    ) : null}
                </>
            )}
        </PageLayout>
    );
};

export default ViewMemberSubpage;
