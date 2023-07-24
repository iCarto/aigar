import {useDomain} from "aigar/domain/provider";
import Grid from "@mui/material/Grid";

const MonthlyInvoicingFilterFormFields = ({filter, handleChange}) => {
    const {sectors, memberTypes, invoiceStatus} = useDomain();

    return (
        <Grid component="form" container spacing={1} flexDirection="row">
            <Grid item xs={3}>
                <label htmlFor="name">Socio</label>
                <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={filter.nombre}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={3}>
                <label htmlFor="sector">Sector</label>
                <select
                    className="form-control"
                    name="sector"
                    value={filter.sector}
                    onChange={handleChange}
                >
                    <option></option>
                    {sectors.map(sector => (
                        <option key={sector.key} value={sector.key}>
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
                    value={filter.tipo_socio}
                    onChange={handleChange}
                >
                    <option></option>
                    {memberTypes.map(memberType => (
                        <option key={memberType.key} value={memberType.key}>
                            {memberType.value}
                        </option>
                    ))}
                </select>
            </Grid>
            <Grid item xs={3}>
                <label htmlFor="estado">Estado</label>
                <select
                    className="form-control"
                    name="estado"
                    value={filter.estado}
                    onChange={handleChange}
                >
                    <option></option>
                    {invoiceStatus.map(invoiceStatus => (
                        <option key={invoiceStatus.key} value={invoiceStatus.key}>
                            {invoiceStatus.value}
                        </option>
                    ))}
                </select>
            </Grid>
        </Grid>
    );
};

export default MonthlyInvoicingFilterFormFields;
