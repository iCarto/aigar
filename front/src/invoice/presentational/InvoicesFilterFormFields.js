import {FormSelect} from "base/form";
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
                <label htmlFor="name">Número</label>
                <input
                    type="text"
                    className="form-control"
                    name="numero"
                    value={fields.numero}
                    onChange={handleInputChange}
                />
            </Grid>
            <Grid item xs>
                <label htmlFor="name">Socio</label>
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
        </>
    );
};

export default InvoicesFilterFormFields;
