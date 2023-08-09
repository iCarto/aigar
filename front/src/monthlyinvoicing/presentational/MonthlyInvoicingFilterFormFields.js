import {FormSelect} from "base/form";
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
                <label htmlFor="nombre">Socio</label>
                <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={fields.nombre}
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
                    label="Tipo de socio"
                    name="tipo_socio"
                    options={domains.memberTypes}
                    onChange={handleInputChange}
                    value={fields.tipo_socio}
                />
            </Grid>
            <Grid item xs>
                <FormSelect
                    label="Estado"
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
