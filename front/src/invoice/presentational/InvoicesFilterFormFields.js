import {useDomain} from "aigar/domain/provider";
import {useList} from "base/entity/provider";
import Grid from "@mui/material/Grid";

const InvoicesFilterFormFields = ({handleChange}) => {
    const {sectors} = useDomain();
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
                <label htmlFor="name">Número</label>
                <input
                    type="text"
                    className="form-control"
                    name="numero"
                    value={filter?.numero}
                    onChange={handleInputChange}
                />
            </Grid>
            <Grid item xs={3}>
                <label htmlFor="name">Socio</label>
                <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={filter?.nombre}
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
                    {sectors.map(sector => (
                        <option key={sector.key} value={sector.key}>
                            {sector.value}
                        </option>
                    ))}
                </select>
            </Grid>
        </Grid>
    );
};

export default InvoicesFilterFormFields;
