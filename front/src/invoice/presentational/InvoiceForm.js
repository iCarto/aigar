import {DomainProvider} from "aigar/domain/provider";
import {EntityFormLayout} from "base/entity/components/form";
import {ESTADOS_FACTURA, createInvoice, refreshInvoiceValues} from "invoice/model";
import {MemberDetailShort} from "member/presentational";
import {InvoiceDetailShort, InvoiceFormFields} from ".";
import Grid from "@mui/material/Grid";

const InvoiceForm = ({
    invoice = null,
    member,
    onUpdate,
    onSubmit,
    isSaving = false,
    error = "",
    validationErrors = [],
}) => {
    const getFieldErrorFromProps = field => {
        const fieldErrors = validationErrors
            ? validationErrors.filter(error => error.field === field)
            : [];
        return fieldErrors.map(error => error.msg).join(<br />);
    };

    const getFormDataFromProps = () => {
        let formData = {};
        Object.keys(invoice).forEach(invoiceField => {
            formData[invoiceField] = {};
            formData[invoiceField].value = invoice[invoiceField];
            formData[invoiceField].errors = getFieldErrorFromProps(invoiceField);
        });
        return formData;
    };

    const formData = getFormDataFromProps();
    const isReadOnlyInvoice = invoice?.estado !== ESTADOS_FACTURA.NUEVA;

    const handleChange = (name, value) => {
        const invoiceDataWithNewChange = {
            ...invoice,
            [name]: value,
        };
        let updatedInvoice = createInvoice(invoiceDataWithNewChange);
        updatedInvoice = refreshInvoiceValues(
            updatedInvoice,
            member.consumo_maximo,
            member.consumo_reduccion_fija
        );

        onUpdate(updatedInvoice);
    };

    const handleSubmit = event => {
        event.preventDefault();
        onSubmit(invoice);
    };

    return (
        <EntityFormLayout
            formTitle="Crear factura"
            onSubmit={handleSubmit}
            isSaving={isSaving}
            error={error}
        >
            <DomainProvider>
                <Grid container columnSpacing={1} alignItems="stretch">
                    <Grid item xs={8}>
                        <MemberDetailShort member={member} />
                    </Grid>
                    <Grid item xs={4}>
                        <InvoiceDetailShort invoice={invoice} />
                    </Grid>
                </Grid>
                <InvoiceFormFields
                    isReadOnly={isReadOnlyInvoice}
                    formData={formData}
                    onChange={handleChange}
                />
            </DomainProvider>
        </EntityFormLayout>
    );
};

export default InvoiceForm;