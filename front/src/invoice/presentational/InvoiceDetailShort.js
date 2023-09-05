import {DateUtil} from "base/format/utilities";

import {SectionField, SectionSummaryCard} from "base/ui/section/presentational";
import {InvoiceStatusLabel} from ".";
import Alert from "@mui/material/Alert";

const InvoiceDetailShort = ({invoice, payments = []}) => {
    const message = !invoice?.is_active ? (
        <Alert severity="error" sx={{width: "100%"}}>
            La factura ha sido anulada.
        </Alert>
    ) : null;

    return (
        <SectionSummaryCard>
            {message}
            <SectionField label="Nº recibo" value={invoice?.numero} />
            <SectionField
                label="Mes de cobro"
                value={`${DateUtil.getMonthName(invoice?.mes_facturado)} - ${
                    invoice?.anho
                }`}
            />
            <SectionField
                label="Estado"
                value={<InvoiceStatusLabel estado={invoice?.estado} />}
            />

            {payments?.length ? (
                <div className="field-label p-2 row no-gutters">
                    <label className="col-md-5">Pago</label>
                    <span>
                        {payments?.map(payment => {
                            return (
                                <div key={payment.id}>
                                    {payment.fecha} -{" "}
                                    <span className="dollar">{payment.monto}</span>
                                </div>
                            );
                        })}
                    </span>
                </div>
            ) : null}
        </SectionSummaryCard>
    );
};

export default InvoiceDetailShort;
