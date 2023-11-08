import {DateUtil} from "base/format/utilities";
import {FormSelect} from "base/form";
import Grid from "@mui/material/Grid";

const InvoicesStatsFilterFormFields = ({onFieldChange, fields, domains}) => {
    const handleInputChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        onFieldChange({[name]: value});
    };

    const monthsList = domains.invoicingMonths.map(month => {
        return {
            key: month.id_mes_facturacion,
            value: `${DateUtil.getMonthName(month.mes)} - ${month.anho}`,
        };
    });

    return (
        <>
            <Grid item xs>
                <FormSelect
                    label="Sector"
                    name="sector"
                    options={domains.sectors}
                    onChange={handleInputChange}
                    value={fields.sector}
                    showEmptyOption
                    removeMargin
                />
            </Grid>
            <Grid item xs>
                <FormSelect
                    label="Mes de inicio"
                    name="startInvoicingMonth"
                    options={monthsList}
                    onChange={handleInputChange}
                    value={fields.startInvoicingMonth}
                    showEmptyOption
                    removeMargin
                />
            </Grid>
            <Grid item xs>
                <FormSelect
                    label="Mes de fin"
                    name="endInvoicingMonth"
                    options={monthsList}
                    onChange={handleInputChange}
                    value={fields.endInvoicingMonth}
                    showEmptyOption
                    removeMargin
                />
            </Grid>
        </>
    );
};

export default InvoicesStatsFilterFormFields;
