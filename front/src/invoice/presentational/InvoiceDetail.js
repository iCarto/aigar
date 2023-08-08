import {MemberDetail} from "member/presentational";
import {SectionCard} from "base/ui/section/presentational";
import {InvoiceDetailShort} from ".";

import Grid from "@mui/material/Grid";

const InvoiceDetail = ({invoice, member, payments}) => {
    return (
        <SectionCard>
            <Grid container columnSpacing={1} alignItems="stretch">
                {member ? (
                    <Grid item xs={8}>
                        <MemberDetail member={member} isSummary />
                    </Grid>
                ) : null}
                {invoice ? (
                    <Grid item xs={4}>
                        <InvoiceDetailShort invoice={invoice} payments={payments} />
                    </Grid>
                ) : null}
            </Grid>
            <div className="row m-3">
                <div className="field-label p-2 col-md-2 row no-gutters"></div>
                <div className="field-label p-2 col-md-3 row no-gutters">
                    <label className="col-6">Caudal anterior</label>
                    <span className="cubic-metre">{invoice?.caudal_anterior}</span>
                </div>
                <div className="field-label p-2 col-md-3 row no-gutters">
                    <label className="col-6">Caudal actual</label>
                    <span className="cubic-metre">{invoice?.caudal_actual}</span>
                </div>
                <div className="field-label p-2 col-md-3 row no-gutters">
                    <label className="col-6">Consumo</label>
                    <strong className="cubic-metre">{invoice?.consumo}</strong>
                </div>
            </div>
            <div className="row">
                <div className="field-label p-2 col-md-4 offset-md-4 row">
                    <label className="col-8">Cuota fija</label>
                    <span className="col-2 dollar">{invoice?.cuota_fija}</span>
                </div>
                <div className="field-label p-2 col-md-4 offset-md-4 row">
                    <label className="col-8">Cuota variable</label>
                    <span className="col-2 dollar">{invoice?.cuota_variable}</span>
                </div>
                <div className="field-label p-2 col-md-4 offset-md-4 row">
                    <label className="col-8">Comisión de pago</label>
                    <span className="col-2 dollar">{invoice?.comision}</span>
                </div>
                <div className="field-label p-2 col-md-4 offset-md-4 row">
                    <label className="col-8">Ahorro por mano de obra</label>
                    <span className="col-2 dollar">{invoice?.ahorro}</span>
                </div>
                <div className="field-label p-2 col-md-4 offset-md-4 row">
                    <label className="col-8">Recargo por mora</label>
                    <span className="col-2 dollar">{invoice?.mora}</span>
                </div>
                <div className="field-label p-2 col-md-4 offset-md-4 row">
                    <label className="col-8">Inasistencia a Asamblea</label>
                    <span className="col-2 dollar">{invoice?.asamblea}</span>
                </div>
                <div className="field-label p-2 col-md-4 offset-md-4 row">
                    <label className="col-8">Nuevo derecho</label>
                    <span className="col-2 dollar">{invoice?.derecho}</span>
                </div>
                <div className="field-label p-2 col-md-4 offset-md-4 row">
                    <label className="col-8">Re-conexión</label>
                    <span className="col-2 dollar">{invoice?.reconexion}</span>
                </div>
                <div className="field-label p-2 col-md-4 offset-md-4 row">
                    <label className="col-8">Traspaso</label>
                    <span className="col-2 dollar">{invoice?.traspaso}</span>
                </div>
                <div className="field-label p-2 col-md-4 offset-md-4 row">
                    <label className="col-8">Otros</label>
                    <span className="col-2 dollar">{invoice?.otros}</span>
                </div>
                <div className="field-label p-2 col-md-4 offset-md-4 row">
                    <label className="col-8" style={{fontStyle: "italic"}}>
                        Saldo pendiente
                    </label>
                    <span className="col-2 dollar">{invoice?.saldo_pendiente}</span>
                </div>
                <div
                    className="field-label p-2 col-md-4 offset-md-4 row"
                    style={{borderTop: "1px solid #ccc"}}
                >
                    <label className="col-8">
                        <strong>Total</strong>
                    </label>
                    <strong className="col-2 dollar">{invoice?.total}</strong>
                </div>
            </div>
        </SectionCard>
    );
};

export default InvoiceDetail;
