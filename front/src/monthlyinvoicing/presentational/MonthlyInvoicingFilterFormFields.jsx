import {FormInputText, FormSelect} from "base/form";
import Grid from "@mui/material/Grid";

const MonthlyInvoicingFilterFormFields = ({onFieldChange, fields, domains}) => {
    const handleInputChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        onFieldChange({[name]: value});
    };

    return (
        <>
            <Grid item xs>
                <FormInputText
                    label="Nombre/nº de socio/a"
                    name="socio_factura"
                    value={fields.socio_factura}
                    onChange={handleInputChange}
                    margin="none"
                />
            </Grid>
            <Grid item xs>
                <FormSelect
                    label="Sector"
                    name="sector"
                    options={domains.sectors}
                    onChange={handleInputChange}
                    value={fields.sector}
                    showEmptyOption
                    removeMargin
                />
            </Grid>
            <Grid item xs>
                <FormSelect
                    label="Tipo de socio/a"
                    name="status"
                    options={domains.memberTypes}
                    onChange={handleInputChange}
                    value={fields.status}
                    showEmptyOption
                    removeMargin
                />
            </Grid>
            <Grid item xs>
                <FormSelect
                    label="Estado del recibo"
                    name="estado"
                    options={domains.invoiceStatus}
                    onChange={handleInputChange}
                    value={fields.estado}
                    showEmptyOption
                    removeMargin
                />
            </Grid>
        </>
    );
};

export default MonthlyInvoicingFilterFormFields;
