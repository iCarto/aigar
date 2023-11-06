import {useDomain} from "aigar/domain/provider";
import {CURRENCY_SYMBOL, WATER_CONSUMPTION_SYMBOL} from "base/format/config/i18n";
import {FormInputInteger, FormInputDecimal, FormCheckboxFieldCombo} from "base/form";
import Grid from "@mui/material/Grid";

const InvoiceFormFields = ({formData, isReadOnly, onChange}) => {
    const {aigarConfig} = useDomain();
    const isNewInvoice = formData?.id.value == -1;

    const handleChangeField = event => {
        const name = event.target.name;
        const value = event.target.value;
        onChange(name, value);
    };

    const handleChangeCheckBox = (name, value) => {
        onChange(name, value);
    };

    return (
        <Grid container justifyContent="center" my={1}>
            <Grid item container direction="row" columnSpacing={3} mb={1}>
                <Grid item xs={4}>
                    <FormInputInteger
                        label="Caudal anterior"
                        name="caudal_anterior"
                        field={formData?.caudal_anterior}
                        onChange={handleChangeField}
                        readOnly={!isNewInvoice}
                        endAdornment={WATER_CONSUMPTION_SYMBOL}
                    />
                </Grid>
                <Grid item xs={4}>
                    <FormInputInteger
                        label="Caudal actual"
                        name="caudal_actual"
                        field={formData?.caudal_actual}
                        onChange={handleChangeField}
                        readOnly={isReadOnly}
                        endAdornment={WATER_CONSUMPTION_SYMBOL}
                    />
                </Grid>
                <Grid item xs={4}>
                    <FormInputDecimal
                        label="Consumo"
                        name="consumo"
                        field={formData?.consumo}
                        onChange={handleChangeField}
                        readOnly={true}
                        endAdornment={WATER_CONSUMPTION_SYMBOL}
                    />
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <FormInputDecimal
                    label="Cuota fija"
                    name="cuota_fija"
                    field={formData?.cuota_fija}
                    onChange={handleChangeField}
                    readOnly
                    endAdornment={CURRENCY_SYMBOL}
                />
                <FormInputDecimal
                    label="Cuota variable"
                    name="cuota_variable"
                    field={formData?.cuota_variable}
                    onChange={handleChangeField}
                    readOnly={!isNewInvoice}
                    endAdornment={CURRENCY_SYMBOL}
                />
                <FormInputDecimal
                    label="Comisión de pago"
                    name="comision"
                    field={formData?.comision}
                    onChange={handleChangeField}
                    readOnly={!isNewInvoice}
                    endAdornment={CURRENCY_SYMBOL}
                />
                <FormInputDecimal
                    label="Ahorro para mano de obra"
                    name="ahorro"
                    field={formData?.ahorro}
                    onChange={handleChangeField}
                    readOnly={!isNewInvoice}
                    endAdornment={CURRENCY_SYMBOL}
                />
                <FormInputDecimal
                    label="Recargo por mora"
                    name="mora"
                    field={formData?.mora}
                    onChange={handleChangeField}
                    readOnly
                    endAdornment={CURRENCY_SYMBOL}
                />
                <FormCheckboxFieldCombo
                    label="Inasistencia a asamblea"
                    name="asamblea"
                    value={formData?.asamblea.value}
                    predefinedValue={aigarConfig?.asamblea}
                    onChange={handleChangeCheckBox}
                    endAdornment={CURRENCY_SYMBOL}
                />
                <FormCheckboxFieldCombo
                    label="Inasistencia a jornada de trabajo"
                    name="jornada_trabajo"
                    value={formData?.jornada_trabajo.value}
                    predefinedValue={aigarConfig?.jornada_trabajo}
                    onChange={handleChangeCheckBox}
                    endAdornment={CURRENCY_SYMBOL}
                />
                <FormInputDecimal
                    label="Nuevo derecho"
                    name="derecho"
                    field={formData?.derecho}
                    onChange={handleChangeField}
                    readOnly
                    endAdornment={CURRENCY_SYMBOL}
                />
                <FormCheckboxFieldCombo
                    label="Re-conexión"
                    name="reconexion"
                    value={formData?.reconexion.value}
                    predefinedValue={aigarConfig?.reconexion}
                    onChange={handleChangeCheckBox}
                    endAdornment={CURRENCY_SYMBOL}
                />
                <FormCheckboxFieldCombo
                    label="Traspaso de derecho"
                    name="traspaso"
                    value={formData?.traspaso.value}
                    predefinedValue={aigarConfig?.traspaso_derecho}
                    onChange={handleChangeCheckBox}
                    endAdornment={CURRENCY_SYMBOL}
                />
                <FormInputDecimal
                    label="Otros"
                    name="otros"
                    field={formData?.otros}
                    onChange={handleChangeField}
                    readOnly={isReadOnly}
                    endAdornment={CURRENCY_SYMBOL}
                />
                <FormInputDecimal
                    label="Saldo pendiente"
                    name="saldo_pendiente"
                    field={formData?.saldo_pendiente}
                    onChange={handleChangeField}
                    readOnly={!isNewInvoice}
                    endAdornment={CURRENCY_SYMBOL}
                />
                <FormInputDecimal
                    label="Descuento"
                    name="descuento"
                    field={formData?.descuento}
                    onChange={handleChangeField}
                    readOnly={isReadOnly}
                    endAdornment={CURRENCY_SYMBOL}
                />
                <FormInputDecimal
                    label="Total"
                    name="total"
                    field={formData?.total}
                    onChange={handleChangeField}
                    readOnly={true}
                    endAdornment={CURRENCY_SYMBOL}
                />
            </Grid>
        </Grid>
    );
};

export default InvoiceFormFields;
