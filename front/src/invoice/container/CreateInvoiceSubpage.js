import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {InvoiceService} from "invoice/service";
import {MemberService} from "member/service";
import {InvoicingMonthService} from "monthlyinvoicing/service";
import {DataValidatorService} from "validation/service";

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

    const {num_socio} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadDataForInvoice();
    }, [num_socio]);

    const loadDataForInvoice = () => {
        setIsLoading(true);

        Promise.all([
            MemberService.getMember(num_socio),
            InvoicingMonthService.getInvoicingMonths(),
            InvoiceService.getInvoicesForMember(num_socio),
        ])
            .then(result => {
                const member = result[0];
                const invoicingMonthOpened = result[1].find(
                    invoicingMonth => invoicingMonth.is_open
                );

                const invoicesForMember = result[2].filter(
                    invoice =>
                        invoice.mes_facturacion.toString() ===
                        invoicingMonthOpened.id_mes_facturacion.toString()
                );

                setMember(member);
                setInvoice(
                    createInvoiceForMember(
                        member,
                        invoicingMonthOpened,
                        invoicesForMember.length + 1
                    )
                );
            })
            .catch(error => {
                console.log(error);
                setErrorMessage(
                    "Se ha producido un error y no se han podido obtener los datos."
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleUpdateForm = updatedInvoice => {
        setValidationErrors(DataValidatorService.validateInvoice(updatedInvoice));
        setInvoice({...updatedInvoice, member: parseInt(num_socio)});
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
