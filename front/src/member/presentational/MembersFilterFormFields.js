import Grid from "@mui/material/Grid";
import {FormSelect} from "base/form";

const MembersFilterFormFields = ({onFieldChange, fields, domains}) => {
    const handleInputChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        onFieldChange({[name]: value});
    };

    return (
        <>
            <Grid item xs>
                <label htmlFor="num_socio">Número de socio</label>
                <input
                    type="text"
                    className="form-control"
                    name="num_socio"
                    value={fields.num_socio}
                    onChange={handleInputChange}
                />
            </Grid>
            <Grid item xs>
                <label htmlFor="name">Nombre</label>
                <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={fields.name}
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
        </>
    );
};

export default MembersFilterFormFields;
