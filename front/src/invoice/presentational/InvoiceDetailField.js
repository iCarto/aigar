import Grid from "@mui/material/Grid";
import {NumberUtil} from "base/format/utilities";

const InvoiceDetailField = ({
    label,
    value,
    unit = "dollar",
    containerStyle = {},
    labelStyle = {},
    valueStyle = {},
}) => {
    return (
        <Grid
            item
            container
            xs={5}
            sx={{justifyContent: "space-between", mx: "auto", ...containerStyle}}
        >
            <Grid component="label" sx={{color: "grey", pr: "5px", ...labelStyle}}>
                {label}:
            </Grid>
            <Grid component="span" sx={{...valueStyle}} className={unit}>
                {NumberUtil.formatNumber(value)}
            </Grid>
        </Grid>
    );
};

export default InvoiceDetailField;
