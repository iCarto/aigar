import Grid from "@mui/material/Grid";
import {FormInputInteger, FormInputText, FormSelect} from "base/form";

const MembersFilterFormFields = ({onFieldChange, fields, domains}) => {
    const handleInputChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        onFieldChange({[name]: value});
    };

    return (
        <>
            <Grid item xs>
                <FormInputInteger
                    label="Número de socio/a"
                    name="num_socio"
                    field={fields.num_socio}
                    onChange={handleInputChange}
                />
            </Grid>
            <Grid item xs>
                <FormInputText
                    label="Nombre"
                    name="name"
                    field={fields.name}
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
                    label="Tipo de uso"
                    name="tipo_uso"
                    options={domains.memberUseTypes}
                    onChange={handleInputChange}
                    value={fields.tipo_uso}
                />
            </Grid>
        </>
    );
};

export default MembersFilterFormFields;
