import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {InvoiceService} from "invoice/service";
import {MemberService} from "member/service";
import {DataValidatorService} from "validation";

import {InvoiceForm} from "invoice/presentational";
import {PageLayout} from "base/ui/page";
import {EditInvoiceSidebar} from ".";
import {Spinner} from "base/common";

const EditInvoiceSubpage = ({onSubmit = null}) => {
    const [invoice, setInvoice] = useState(null);
    const [member, setMember] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const {idFactura} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);

        InvoiceService.getInvoice(idFactura)
            .then(invoice => {
                setInvoice(invoice);
                MemberService.getMember(invoice.num_socio).then(member => {
                    setMember(member);
                });
            })
            .catch(error => {
                console.log(error);
                setErrorMessage(
                    "Se ha producido un error y no se han podido obtener los datos de la factura"
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [idFactura]);

    const handleUpdateForm = updatedInvoice => {
        setValidationErrors(DataValidatorService.validateInvoice(updatedInvoice));
        setInvoice(updatedInvoice);
    };

    const handleSubmit = () => {
        console.log("EditInvoiceSubpage.handleSubmit", {invoice});
        setIsSaving(true);

        InvoiceService.updateInvoice(invoice)
            .then(updatedInvoice => {
                if (onSubmit) {
                    onSubmit(updatedInvoice);
                } else {
                    navigate(-1);
                }
            })
            .catch(error => {
                console.log(error);
                setErrorMessage(
                    "Se ha producido un error y no se han podido almacenar los datos de la factura"
                );
            })
            .finally(() => {
                setIsSaving(false);
            });
    };

    const sidebar = <EditInvoiceSidebar />;

    return (
        <PageLayout sidebar={sidebar}>
            {isLoading ? (
                <Spinner message="Cargando datos" />
            ) : invoice ? (
                <InvoiceForm
                    invoice={invoice}
                    member={member}
                    onSubmit={handleSubmit}
                    onUpdate={handleUpdateForm}
                    isSaving={isSaving}
                    error={errorMessage}
                    validationErrors={validationErrors}
                />
            ) : null}
        </PageLayout>
    );
};

export default EditInvoiceSubpage;