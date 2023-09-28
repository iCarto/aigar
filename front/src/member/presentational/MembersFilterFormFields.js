import {FormInputInteger, FormInputText, FormSelect} from "base/form";
import Grid from "@mui/material/Grid";

const MembersFilterFormFields = ({onFieldChange, fields, domains}) => {
    const handleInputChange = event => {
        const name = event.target.name;
        const value = event.target.value || "";
        onFieldChange({[name]: value});
    };

    return (
        <>
            <Grid item xs>
                <FormInputInteger
                    label="Número de socio/a"
                    name="num_socio"
                    value={fields.num_socio}
                    onChange={handleInputChange}
                    margin=""
                />
            </Grid>
            <Grid item xs>
                <FormInputText
                    label="Nombre"
                    name="name"
                    value={fields.name}
                    onChange={handleInputChange}
                    margin=""
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
                <FormSelect
                    label="Tipo de socio/a"
                    name="status"
                    options={domains.memberTypes}
                    onChange={handleInputChange}
                    value={fields.status}
                    showEmptyOption
                />
            </Grid>
            <Grid item xs>
                <FormSelect
                    label="Tipo de uso"
                    name="tipo_uso"
                    options={domains.memberUseTypes}
                    onChange={handleInputChange}
                    value={fields.tipo_uso}
                    showEmptyOption
                />
            </Grid>
        </>
    );
};

export default MembersFilterFormFields;
