import {DateUtil} from "base/format/utilities";
import {CURRENCY_SYMBOL} from "base/format/config/i18n";

import {
    SectionField,
    SectionFieldLabel,
    SectionFieldValue,
    SectionSummaryCard,
} from "base/ui/section/presentational";
import {InvoiceStatusLabel} from ".";
import {ErrorMessage} from "base/error/components";
import Grid from "@mui/material/Grid";

const InvoiceDetailShort = ({invoice, payments = []}) => {
    const inactiveInvoiceMessage = !invoice?.is_active ? (
        <Grid item xs={12}>
            <ErrorMessage message="La factura ha sido anulada." />
        </Grid>
    ) : null;

    return (
        <SectionSummaryCard>
            {inactiveInvoiceMessage}
            <Grid item xs={6}>
                <SectionField label="Nº recibo" value={invoice?.numero} />
            </Grid>
            <Grid item xs={6}>
                <SectionField
                    label="Estado"
                    value={<InvoiceStatusLabel estado={invoice?.estado} />}
                />
            </Grid>
            <Grid item xs={6}>
                <SectionField
                    label="Mes de cobro"
                    value={`${DateUtil.getMonthName(invoice?.mes_facturado)} - ${
                        invoice?.anho
                    }`}
                />
            </Grid>

            {payments?.length ? (
                <Grid item container xs={6} columnSpacing={1}>
                    <Grid item xs={5}>
                        <SectionFieldLabel labelText="Pago/s" />
                    </Grid>
                    <Grid item xs={7}>
                        {payments?.map(payment => {
                            return (
                                <SectionFieldValue
                                    key={payment.id}
                                    value={`${payment.fecha} - ${payment.monto} ${CURRENCY_SYMBOL}`}
                                />
                            );
                        })}
                    </Grid>
                </Grid>
            ) : null}
        </SectionSummaryCard>
    );
};

export default InvoiceDetailShort;
