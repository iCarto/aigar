import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {InvoiceForm} from "invoice/presentational";
import {DataValidatorService} from "validation";
import EditInvoiceSidebar from "./EditInvoiceSidebar";
import {Spinner} from "base/common";

import {createInvoice, refreshInvoiceValues} from "invoice/model";
import {InvoiceService} from "invoice/service";
import {MemberService} from "member/service";
import {ErrorMessage} from "base/error/components";
import {PageLayout} from "base/ui/page";

const EditInvoiceSubpage = ({onSubmit = null}) => {
    const [invoice, setInvoice] = useState(null);
    const [member, setMember] = useState(null);
    const [validationErrors, setValidationErrors] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [error, setError] = useState(null);

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
                setError(
                    "Se ha producido un error y no se han podido obtener los datos de la factura"
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [idFactura]);

    const handleChange = (name, value) => {
        console.log("EditInvoiceSubpage.handleChange", name, value);
        const invoiceDataWithNewChange = Object.assign({}, invoice, {
            [name]: value,
        });
        let updatedInvoice = createInvoice(invoiceDataWithNewChange);
        updatedInvoice = refreshInvoiceValues(
            updatedInvoice,
            member.consumo_maximo,
            member.consumo_reduccion_fija
        );
        console.log({updatedInvoice});
        setInvoice(updatedInvoice);
        setValidationErrors(DataValidatorService.validateInvoice(updatedInvoice));
    };

    const handleSubmit = () => {
        console.log("EditMemberSubpage.handleSubmit", {invoice});
        setIsLoading(true);

        InvoiceService.updateInvoice(invoice)
            .then(updatedInvoice => {
                if (onSubmit) {
                    onSubmit(updatedInvoice);
                } else {
                    handleBack();
                }
            })
            .catch(error => {
                console.log(error);
                setError(
                    "Se ha producido un error y no se han podido almacenar los datos de la factura"
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleBack = () => {
        navigate(-1);
    };

    const sidebar = <EditInvoiceSidebar />;

    const content = isLoading ? (
        <Spinner message="Cargando datos" />
    ) : (
        <>
            <ErrorMessage message={error} />
            <InvoiceForm
                invoice={invoice}
                member={member}
                errors={validationErrors}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                saving={isLoading}
            />
        </>
    );

    return (
        <PageLayout sidebar={sidebar}>
            {isLoading ? <Spinner message="Cargando datos" /> : content}
        </PageLayout>
    );
};

export default EditInvoiceSubpage;
