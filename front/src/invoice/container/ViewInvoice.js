import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";

import {InvoiceService} from "invoice/service";
import {MemberService} from "member/service";
import {PageLayout} from "base/ui/page";
import {Spinner} from "base/common";
import {ErrorMessage} from "base/error/components";
import {InvoiceDetail, InvoiceNavigator} from "invoice/presentational";
import {ViewInvoiceSidebar} from ".";

const ViewInvoice = ({navigatorIds, handleClickSelectInNavigator}) => {
    const [invoice, setInvoice] = useState(null);
    const [member, setMember] = useState(null);
    const [payments, setPayments] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [error, setError] = useState("");

    const {idFactura} = useParams();

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
        <PageLayout sidebar={member ? <ViewInvoiceSidebar invoice={invoice} /> : null}>
            <ErrorMessage message={error} />
            {isLoading ? <Spinner message="Cargando datos" /> : null}
            {navigatorIds ? (
                <InvoiceNavigator
                    selectedId={idFactura}
                    navigatorIds={navigatorIds}
                    handleClickSelect={handleClickSelectInNavigator}
                />
            ) : null}
            <ErrorMessage message={error} />
            <InvoiceDetail invoice={invoice} member={member} payments={payments} />
        </PageLayout>
    );
};

export default ViewInvoice;
