import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {InvoiceService} from "invoice/service";
import {MemberService} from "member/service";
import {DataValidatorService} from "validation/service";
import {useDomain} from "aigar/domain/provider";

import {InvoiceForm} from "invoice/presentational";
import {PageLayout} from "base/ui/page";
import {CreateInvoiceSidebar} from ".";
import {Spinner} from "base/common";
import {
    createInvoice,
    createInvoiceForMember,
    invoice_view_adapter,
} from "invoice/model";

const CreateInvoiceSubpage = () => {
    const [invoice, setInvoice] = useState(createInvoice());
    const [member, setMember] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const {member_id} = useParams();
    const {currentInvoicingMonth} = useDomain();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentInvoicingMonth) loadDataForInvoice();
    }, [member_id, currentInvoicingMonth]);

    const loadDataForInvoice = () => {
        setIsLoading(true);

        Promise.all([
            MemberService.getMember(member_id),
            InvoiceService.getInvoicesForMember(member_id),
        ])
            .then(result => {
                const member = result[0];
                const invoicesForMember = result[1].filter(
                    invoice =>
                        invoice?.mes_facturacion.toString() ===
                        currentInvoicingMonth?.id_mes_facturacion?.toString()
                );

                const currentInvoice = createInvoiceForMember(
                    member,
                    currentInvoicingMonth,
                    invoicesForMember.length + 1
                );

                setMember(member);
                setInvoice(currentInvoice);
            })
            .catch(error => {
                console.log(error);
                setErrorMessage(
                    "Se ha producido un error y no se han podido obtener los datos."
                );
            })
            .finally(() => {
                setErrorMessage("");
                setIsLoading(false);
            });
    };

    const handleUpdateForm = updatedInvoice => {
        setValidationErrors(DataValidatorService.validateInvoice(updatedInvoice));
        setInvoice({...updatedInvoice, member: parseInt(member_id)});
    };

    const handleSubmit = () => {
        setIsSaving(true);

        InvoiceService.createInvoice(invoice_view_adapter(invoice))
            .then(createdInvoice => {
                setInvoice(createdInvoice);
                navigate(`/facturas/${createdInvoice.id}`);
            })
            .catch(error => {
                console.log(error);
                setErrorMessage(
                    "Se ha producido un error y no se han podido almacenar los datos."
                );
            })
            .finally(() => {
                setIsSaving(false);
            });
    };

    const sidebar = <CreateInvoiceSidebar />;

    return (
        <PageLayout sidebar={sidebar}>
            {isLoading ? (
                <Spinner message="Cargando datos" />
            ) : (
                <InvoiceForm
                    invoice={invoice}
                    member={member}
                    onSubmit={handleSubmit}
                    onUpdate={handleUpdateForm}
                    isSaving={isSaving}
                    error={errorMessage}
                    validationErrors={validationErrors}
                />
            )}
        </PageLayout>
    );
};

export default CreateInvoiceSubpage;
