import {useDomain} from "aigar/domain/provider";
import {useList} from "base/entity/provider";
import {DateUtil} from "utilities";
import Grid from "@mui/material/Grid";

const InvoicesStatsFilterFormFields = ({handleChange}) => {
    const {sectors, invoicingMonths} = useDomain();
    const {filter} = useList();

    // TO-DO: Refactor this in all filter forms
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
            <Grid item xs={3}>
                <label htmlFor="startInvoicingMonth">Mes de inicio</label>
                <select
                    className="form-control"
                    name="startInvoicingMonth"
                    value={filter?.startInvoicingMonth}
                    onChange={handleInputChange}
                >
                    <option></option>
                    {invoicingMonths.map(invoicingMonth => (
                        <option
                            key={invoicingMonth.id_mes_facturacion}
                            value={invoicingMonth.id_mes_facturacion}
                        >
                            {DateUtil.getMonthName(invoicingMonth.mes)} -{" "}
                            {invoicingMonth.anho}
                        </option>
                    ))}
                </select>
            </Grid>
            <Grid item xs={3}>
                <label htmlFor="endInvoicingMonth">Mes de fin</label>
                <select
                    className="form-control"
                    name="endInvoicingMonth"
                    value={filter?.endInvoicingMonth}
                    onChange={handleInputChange}
                >
                    <option></option>
                    {invoicingMonths.map(invoicingMonth => (
                        <option
                            key={invoicingMonth.id_mes_facturacion}
                            value={invoicingMonth.id_mes_facturacion}
                        >
                            {DateUtil.getMonthName(invoicingMonth.mes)} -{" "}
                            {invoicingMonth.anho}
                        </option>
                    ))}
                </select>
            </Grid>
        </Grid>
    );
};

export default InvoicesStatsFilterFormFields;
