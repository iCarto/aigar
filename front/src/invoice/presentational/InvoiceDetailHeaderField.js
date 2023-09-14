import Grid from "@mui/material/Grid";
import {NumberUtil} from "base/format/utilities";

const InvoiceDetailHeaderField = ({
    label,
    value,
    unit = "cubic-metre",
    valueStyle = {},
}) => {
    return (
        <Grid item>
            <Grid component="label" sx={{color: "grey", pr: 2}}>
                {label}:
            </Grid>
            <Grid component="span" sx={{...valueStyle}} className={unit}>
                {NumberUtil.formatNumber(value)}
            </Grid>
        </Grid>
    );
};

export default InvoiceDetailHeaderField;
