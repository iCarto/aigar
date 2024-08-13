import {Typography} from "@mui/material";

import useTheme from "@mui/material/styles/useTheme";

export const PreviewInvoiceAlertCellTable = ({row, column, cell}) => {
    const theme = useTheme();
    const item = row.original;
    const {errors} = item;

    if (errors && errors.length > 0) {
        const {message = errors[0], type = "error"} = errors[0];
        return (
            <Typography
                sx={{
                    fontSize: "85% !important",
                    color: theme.palette[type].main,
                }}
            >
                {message}
            </Typography>
        );
    }

    return null;
};
