import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";

import {InvoiceService} from "invoice/service";
import {MemberService} from "member/service";
import {PageLayout} from "base/ui/page";
import {SectionHeading} from "base/ui/section/presentational";
import {Spinner} from "base/common";
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
                    "Se ha producido un error y no se han podido obtener los datos del/de la socio/a"
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [num_socio, memberStatus]);

    const handleStatusUpdate = newStatus => {
        setMemberStatus(newStatus);
    };

    return (
        <PageLayout
            sidebar={
                member ? (
                    <MemberPageSidebar
                        member={member}
                        numInvoices={invoices?.length || 0}
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
                                    containerStyle={{justifyContent: "center", mb: 1}}
                                    label={false}
                                >
                                    Facturas
                                </SectionHeading>
                                {invoices?.length ? (
                                    <ListMemberInvoices invoices={invoices} />
                                ) : (
                                    <Alert severity="info">
                                        Aún no se ha emitido ninguna factura para este/a
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
