import {useDomain} from "aigar/domain/provider";
import {useList} from "base/entity/provider";
import Grid from "@mui/material/Grid";

const MembersFilterFormFields = ({handleChange}) => {
    const {sectors, memberTypes} = useDomain();
    const {filter} = useList();

    const handleInputChange = event => {
        const name = event.target.name;
        const value =
            event.target.type === "checkbox"
                ? event.target.checked
                : event.target.value;
        handleChange({[name]: value});
    };

    return (
        <Grid component="form" container spacing={1} flexDirection="row">
            <Grid item xs={3}>
                <label htmlFor="num_socio">Número de socio</label>
                <input
                    type="text"
                    className="form-control"
                    name="num_socio"
                    value={filter?.num_socio}
                    onChange={handleInputChange}
                />
            </Grid>
            <Grid item xs={3}>
                <label htmlFor="name">Nombre</label>
                <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={filter?.name}
                    onChange={handleInputChange}
                />
            </Grid>
            <Grid item xs={3}>
                <label htmlFor="sector">Sector</label>
                <select
                    className="form-control"
                    name="sector"
                    value={filter?.sector}
                    onChange={handleInputChange}
                >
                    <option></option>
                    {sectors.map((sector, index) => (
                        <option key={index} value={sector.key}>
                            {sector.value}
                        </option>
                    ))}
                </select>
            </Grid>
            <Grid item xs={3}>
                <label htmlFor="tipo_socio">Tipo de socio</label>
                <select
                    className="form-control"
                    name="tipo_socio"
                    value={filter?.tipo_socio}
                    onChange={handleInputChange}
                >
                    <option></option>
                    {memberTypes.map((memberType, index) => (
                        <option key={index} value={memberType.key}>
                            {memberType.value}
                        </option>
                    ))}
                </select>
            </Grid>
        </Grid>
    );
};

export default MembersFilterFormFields;
