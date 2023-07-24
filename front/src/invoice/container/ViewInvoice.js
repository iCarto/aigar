import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {InvoiceDetail, InvoiceNavigator} from "invoice/presentational";
import ViewInvoiceSidebar from "./ViewInvoiceSidebar";
import EditInvoice from "./EditInvoice";
import {InvoiceService} from "invoice/service";
import {Spinner} from "base/common";
import {ErrorMessage} from "base/error/components";
import {MemberService} from "member/service";

const ViewInvoice = ({navigatorIds, handleClickSelectInNavigator}) => {
    const [invoice, setInvoice] = useState(null);
    const [member, setMember] = useState(null);
    const [payments, setPayments] = useState(null);
    const [view, setView] = useState("view");
    const [isLoading, setIsLoading] = useState(null);
    const [error, setError] = useState("");

    const {idFactura} = useParams();
    const navigate = useNavigate();

    // useEffect(() => {
    //     const idFacturaProp =
    //         props.idFactura || parseInt(props.match.params.idFactura);
    //     if (idFacturaProp !== idFactura) {
    //         setInvoice(null);
    //         // setIdFactura(idFacturaProp);
    //     }
    // }, [props.idFactura, idFactura, idFactura]);

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

    const handleBack = () => {
        console.log("ViewInvoice.handleBack");
        navigate(-1);
    };

    const handleClickEdit = () => {
        setView("edit");
    };

    const handleBackEdit = () => {
        setView("view");
    };

    const handleSubmitEdit = updatedItem => {
        setView("view");
        setInvoice(updatedItem);
    };

    const handleSuccessPrint = () => {};

    const handleSuccessCreateNewInvoiceVersion = (
        new_version_idFactura,
        old_version_idFactura
    ) => {
        // TO-DO: Implement (previously received function from parent component (ViewMonthlyInvoicingPage))
        navigate("/facturas/" + new_version_idFactura);
    };

    const viewContent = (
        <>
            <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                <ViewInvoiceSidebar
                    invoice={invoice}
                    handleClickEditInvoice={handleClickEdit}
                    handleSuccessPrintInvoices={handleSuccessPrint}
                    handleSuccessCreateNewInvoiceVersion={
                        handleSuccessCreateNewInvoiceVersion
                    }
                    handleBack={handleBack}
                />
            </nav>
            <div className="col-md-10 offset-md-2">
                <div className="container">
                    {navigatorIds ? (
                        <InvoiceNavigator
                            selectedId={idFactura}
                            navigatorIds={navigatorIds}
                            handleClickSelect={handleClickSelectInNavigator}
                        />
                    ) : null}
                    <ErrorMessage message={error} />
                    <InvoiceDetail
                        invoice={invoice}
                        member={member}
                        payments={payments}
                    />
                </div>
            </div>
        </>
    );

    const editContent = (
        <EditInvoice handleSubmit={handleSubmitEdit} handleBack={handleBackEdit} />
    );

    const content = isLoading ? (
        <Spinner message="Cargando datos" />
    ) : view === "view" ? (
        viewContent
    ) : (
        editContent
    );

    return content;
};

export default ViewInvoice;
