import {FormInputInteger, FormInputText, FormSelect} from "base/form";
import Grid from "@mui/material/Grid";

const InvoicesFilterFormFields = ({onFieldChange, fields, domains}) => {
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
                />
            </Grid>
            <Grid item xs>
                <FormInputInteger
                    label="Número de factura"
                    name="numero"
                    value={fields.numero}
                    onChange={handleInputChange}
                    margin="none"
                />
            </Grid>
            <Grid item xs>
                <FormSelect
                    label="Estado de la factura"
                    name="estado"
                    options={domains.invoiceStatus}
                    onChange={handleInputChange}
                    value={fields.estado}
                    showEmptyOption
                />
            </Grid>
        </>
    );
};

export default InvoicesFilterFormFields;
