import {DateUtil} from "base/format/utilities";
import Grid from "@mui/material/Grid";

const InvoicesStatsFilterFormFields = ({onFieldChange, fields, domains}) => {
    const handleInputChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        onFieldChange({[name]: value});
    };

    return (
        <>
            <Grid item xs>
                <label htmlFor="sector">Sector</label>
                <select
                    className="form-control"
                    name="sector"
                    value={fields.sector}
                    onChange={handleInputChange}
                >
                    <option></option>
                    {domains.sectors.map((sector, index) => (
                        <option key={index} value={sector.key}>
                            {sector.value}
                        </option>
                    ))}
                </select>
            </Grid>
            <Grid item xs>
                <label htmlFor="startInvoicingMonth">Mes de inicio</label>
                <select
                    className="form-control"
                    name="startInvoicingMonth"
                    value={fields.startInvoicingMonth}
                    onChange={handleInputChange}
                >
                    <option></option>
                    {domains.invoicingMonths.map((invoicingMonth, index) => (
                        <option key={index} value={invoicingMonth.id_mes_facturacion}>
                            {DateUtil.getMonthName(invoicingMonth.mes)} -{" "}
                            {invoicingMonth.anho}
                        </option>
                    ))}
                </select>
            </Grid>
            <Grid item xs>
                <label htmlFor="endInvoicingMonth">Mes de fin</label>
                <select
                    className="form-control"
                    name="endInvoicingMonth"
                    value={fields.endInvoicingMonth}
                    onChange={handleInputChange}
                >
                    <option></option>
                    {domains.invoicingMonths.map((invoicingMonth, index) => (
                        <option key={index} value={invoicingMonth.id_mes_facturacion}>
                            {DateUtil.getMonthName(invoicingMonth.mes)} -{" "}
                            {invoicingMonth.anho}
                        </option>
                    ))}
                </select>
            </Grid>
        </>
    );
};

export default InvoicesStatsFilterFormFields;
