import {MemberDetail} from "member/presentational";
import {InvoiceDetailField, InvoiceDetailHeaderField, InvoiceDetailShort} from ".";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

const InvoiceDetail = ({invoice, member, payments}) => {
    return (
        <Box mb={3}>
            <Box display="flex" flexDirection="column">
                {invoice ? (
                    <Box mb={1}>
                        <InvoiceDetailShort invoice={invoice} payments={payments} />
                    </Box>
                ) : null}
                {member ? (
                    <Box>
                        <MemberDetail member={member} isSummary />
                    </Box>
                ) : null}
            </Box>
            <Grid container flexDirection="row" justifyContent="space-around" my={2}>
                <InvoiceDetailHeaderField
                    label="Caudal anterior"
                    value={invoice?.caudal_anterior}
                />
                <InvoiceDetailHeaderField
                    label="Caudal actual"
                    value={invoice?.caudal_actual}
                />
                <InvoiceDetailHeaderField
                    label="Consumo"
                    value={invoice?.consumo}
                    valueStyle={{fontWeight: 700}}
                />
            </Grid>

            <Grid container flexDirection="column" spacing={1}>
                <InvoiceDetailField label="Cuota fija" value={invoice?.cuota_fija} />
                <InvoiceDetailField
                    label="Cuota variable"
                    value={invoice?.cuota_variable}
                />
                <InvoiceDetailField
                    label="Comisión de pago"
                    value={invoice?.comision}
                />
                <InvoiceDetailField
                    label="Ahorro para mano de obra"
                    value={invoice?.ahorro}
                />
                <InvoiceDetailField label="Recargo por mora" value={invoice?.mora} />
                <InvoiceDetailField
                    label="Inasistencia a asambleas"
                    value={invoice?.asamblea}
                />
                <InvoiceDetailField
                    label="Jornada de trabajo"
                    value={invoice?.jornada_trabajo}
                />
                <InvoiceDetailField label="Nuevo derecho" value={invoice?.derecho} />
                <InvoiceDetailField label="Re-conexión" value={invoice?.reconexion} />
                <InvoiceDetailField
                    label="Traspaso de derecho"
                    value={invoice?.traspaso}
                />
                <InvoiceDetailField label="Otros" value={invoice?.otros} />
                <InvoiceDetailField
                    label="Saldo pendiente"
                    value={invoice?.saldo_pendiente}
                    labelStyle={{fontStyle: "italic"}}
                />
                <InvoiceDetailField
                    label="Descuento"
                    value={invoice?.descuento}
                    negativeField
                />
                <InvoiceDetailField
                    label="Total"
                    value={invoice?.total}
                    containerStyle={{mt: 1, borderTop: "1px solid #ccc"}}
                    labelStyle={{fontWeight: 700}}
                    valueStyle={{fontWeight: 700}}
                />
            </Grid>
        </Box>
    );
};

export default InvoiceDetail;
