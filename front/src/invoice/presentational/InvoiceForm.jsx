import {InvoiceService} from "invoice/service";
import {ESTADOS_FACTURA, createInvoice} from "invoice/model";

import {EntityFormLayout} from "base/entity/components/form";
import {MemberDetail} from "member/presentational";
import {InvoiceDetailShort, InvoiceFormFields} from ".";
import Grid from "@mui/material/Grid";

const WAIT_INTERVAL = 500;
let timerID;

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
        const invoiceDataWithNewValue = {
            ...invoice,
            [name]: value,
        };

        let updatedInvoice = createInvoice(invoiceDataWithNewValue);
        onUpdate(updatedInvoice);

        clearTimeout(timerID);

        timerID = setTimeout(() => {
            updateInvoice(invoiceDataWithNewValue);
        }, WAIT_INTERVAL);
    };

    const updateInvoice = updatedData => {
        InvoiceService.updateInvoiceTotal(updatedData).then(updatedInvoice => {
            onUpdate(updatedInvoice);
        });
    };

    const handleSubmit = event => {
        event.preventDefault();
        const updatedInvoice = {...invoice, member: invoice.member_id};
        onSubmit(updatedInvoice);
    };

    return (
        <EntityFormLayout
            formTitle={invoice.isNewInvoice ? "Crear recibo" : "Modificar recibo"}
            onSubmit={handleSubmit}
            isSaving={isSaving}
            error={error}
        >
            <Grid container direction="column" rowSpacing={1} alignItems="stretch">
                <Grid item>
                    <MemberDetail member={member} isSummary />
                </Grid>
                <Grid item>
                    <InvoiceDetailShort invoice={invoice} />
                </Grid>
            </Grid>
            <InvoiceFormFields
                isReadOnly={isReadOnlyInvoice}
                formData={formData}
                onChange={handleChange}
            />
        </EntityFormLayout>
    );
};

export default InvoiceForm;
