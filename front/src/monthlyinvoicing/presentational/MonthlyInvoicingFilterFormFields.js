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
                    label="Nombre de socio/a"
                    name="nombre"
                    field={fields.nombre}
                    onChange={handleInputChange}
                />
            </Grid>
            <Grid item xs>
                <FormSelect
                    label="Sector"
                    name="sector"
                    options={domains.sectors}
                    onChange={handleInputChange}
                    value={fields.sector}
                />
            </Grid>
            <Grid item xs>
                <FormSelect
                    label="Tipo de socio/a"
                    name="status"
                    options={domains.memberTypes}
                    onChange={handleInputChange}
                    value={fields.status}
                />
            </Grid>
            <Grid item xs>
                <FormSelect
                    label="Estado de la factura"
                    name="estado"
                    options={domains.invoiceStatus}
                    onChange={handleInputChange}
                    value={fields.estado}
                />
            </Grid>
        </>
    );
};

export default MonthlyInvoicingFilterFormFields;
