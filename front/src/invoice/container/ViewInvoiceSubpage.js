import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";

import {InvoiceService} from "invoice/service";
import {MemberService} from "member/service";
import {useInvoicesList} from "invoice/provider";

import {PageLayout} from "base/ui/page";
import {Spinner} from "base/common";
import {ErrorMessage} from "base/error/components";
import {InvoiceDetail, InvoiceNavigator} from "invoice/presentational";
import {InvoicePageSidebar} from ".";
import {useMonthlyInvoicingList} from "monthlyinvoicing/provider";

const ViewInvoiceSubpage = () => {
    const [invoice, setInvoice] = useState(null);
    const [member, setMember] = useState(null);
    const [payments, setPayments] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [error, setError] = useState("");

    const {idFactura} = useParams();
    const allInvoicesList = useInvoicesList();
    const monthlyInvoicesList = useMonthlyInvoicingList();

    const invoicesIds =
        allInvoicesList?.invoicesIds || monthlyInvoicesList?.invoicesIds;

    const urlPath = allInvoicesList ? "facturas" : "facturas_mes";
    const urlPathBack = allInvoicesList ? "/facturas" : "/";

    useEffect(() => {
        setIsLoading(true);

        InvoiceService.getInvoice(idFactura)
            .then(invoiceData => {
                setInvoice(invoiceData);
                MemberService.getMember(invoiceData.num_socio).then(memberData => {
                    setMember(memberData);
                });
                InvoiceService.getInvoicePayments(idFactura).then(paymentsData => {
                    setPayments(paymentsData);
                });
            })
            .catch(error => {
                console.log(error);
                setError(
                    "Se ha producido un error y no se han podido obtener los datos de la factura"
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [idFactura]);

    return (
        <PageLayout
            sidebar={<InvoicePageSidebar invoice={invoice} urlPathBack={urlPathBack} />}
        >
            <ErrorMessage message={error} />
            {isLoading ? <Spinner message="Cargando datos" /> : null}
            {invoicesIds?.length ? (
                <InvoiceNavigator
                    currentInvoiceId={idFactura}
                    navigatorIds={invoicesIds}
                    path={urlPath}
                />
            ) : null}
            {invoice ? (
                <InvoiceDetail invoice={invoice} member={member} payments={payments} />
            ) : null}
        </PageLayout>
    );
};

export default ViewInvoiceSubpage;